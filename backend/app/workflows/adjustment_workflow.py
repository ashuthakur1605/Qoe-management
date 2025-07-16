"""
LangGraph workflow for AI-powered adjustment processing
"""
from typing import Dict, List, Any, TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from app.core.config import settings
from app.models.adjustment import AdjustmentType
import json

# State schema for the workflow
class AdjustmentState(TypedDict):
    document_content: str
    document_type: str
    project_context: Dict[str, Any]
    identified_adjustments: List[Dict[str, Any]]
    processed_adjustments: List[Dict[str, Any]]
    materiality_threshold: float
    materiality_percentage: float

# Output schema for adjustment suggestions
class AdjustmentSuggestion(BaseModel):
    adjustment_type: str = Field(description="Type of adjustment identified")
    title: str = Field(description="Brief title for the adjustment")
    description: str = Field(description="Detailed description of the adjustment")
    amount: float = Field(description="Monetary amount of the adjustment")
    confidence_score: float = Field(description="AI confidence score (0-1)")
    precision_score: float = Field(description="Precision of the calculation (0-1)")
    narrative: str = Field(description="AI-generated narrative justification")
    source_data: Dict[str, Any] = Field(description="Source data that led to this adjustment")
    calculation_method: str = Field(description="How the amount was calculated")

class AdjustmentWorkflow:
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.DEFAULT_LLM_MODEL,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """Build the LangGraph workflow"""
        workflow = StateGraph(AdjustmentState)
        
        # Add nodes
        workflow.add_node("analyze_document", self._analyze_document)
        workflow.add_node("identify_adjustments", self._identify_adjustments)
        workflow.add_node("calculate_amounts", self._calculate_amounts)
        workflow.add_node("generate_narratives", self._generate_narratives)
        workflow.add_node("apply_materiality", self._apply_materiality)
        
        # Add edges
        workflow.add_edge("analyze_document", "identify_adjustments")
        workflow.add_edge("identify_adjustments", "calculate_amounts")
        workflow.add_edge("calculate_amounts", "generate_narratives")
        workflow.add_edge("generate_narratives", "apply_materiality")
        workflow.add_edge("apply_materiality", END)
        
        # Set entry point
        workflow.set_entry_point("analyze_document")
        
        return workflow.compile()
    
    async def process_document(self, state: AdjustmentState) -> Dict[str, Any]:
        """Process a document through the adjustment workflow"""
        result = await self.graph.ainvoke(state)
        return result
    
    async def _analyze_document(self, state: AdjustmentState) -> AdjustmentState:
        """Analyze document content and extract relevant financial data"""
        prompt = ChatPromptTemplate.from_template("""
        You are a financial analyst specializing in Quality of Earnings analysis.
        
        Document Type: {document_type}
        Document Content: {document_content}
        
        Analyze this document and extract:
        1. Key financial figures and amounts
        2. Unusual or one-time items
        3. Related party transactions
        4. Potential quality of earnings adjustments
        5. Executive compensation details
        6. Any extraordinary or non-recurring items
        
        Return a structured analysis focusing on items that might require QoE adjustments.
        """)
        
        response = await self.llm.ainvoke(
            prompt.format(
                document_type=state["document_type"],
                document_content=state["document_content"][:5000]  # Limit content length
            )
        )
        
        # Store analysis in state
        state["analysis"] = response.content
        return state
    
    async def _identify_adjustments(self, state: AdjustmentState) -> AdjustmentState:
        """Identify potential adjustments based on document analysis"""
        adjustment_types = [adj_type.value for adj_type in AdjustmentType]
        
        prompt = ChatPromptTemplate.from_template("""
        Based on the document analysis, identify potential Quality of Earnings adjustments.
        
        Document Analysis: {analysis}
        Project Context: {project_context}
        
        Available Adjustment Types: {adjustment_types}
        
        For each potential adjustment, provide:
        1. Adjustment type (from the available types)
        2. Brief description
        3. Estimated impact (if calculable)
        4. Confidence level
        5. Source data/evidence
        
        Return as JSON array with each adjustment as an object.
        """)
        
        response = await self.llm.ainvoke(
            prompt.format(
                analysis=state.get("analysis", ""),
                project_context=json.dumps(state["project_context"]),
                adjustment_types=", ".join(adjustment_types)
            )
        )
        
        try:
            identified_adjustments = json.loads(response.content)
            state["identified_adjustments"] = identified_adjustments
        except json.JSONDecodeError:
            state["identified_adjustments"] = []
        
        return state
    
    async def _calculate_amounts(self, state: AdjustmentState) -> AdjustmentState:
        """Calculate specific amounts for identified adjustments"""
        processed_adjustments = []
        
        for adjustment in state["identified_adjustments"]:
            prompt = ChatPromptTemplate.from_template("""
            Calculate the specific monetary amount for this Quality of Earnings adjustment:
            
            Adjustment Details: {adjustment}
            Document Content: {document_content}
            
            Provide:
            1. Calculated amount (if possible)
            2. Calculation methodology
            3. Confidence in the calculation (0-1)
            4. Precision score (0-1)
            5. Any assumptions made
            
            If unable to calculate exact amount, provide an estimated range and explain why.
            """)
            
            response = await self.llm.ainvoke(
                prompt.format(
                    adjustment=json.dumps(adjustment),
                    document_content=state["document_content"][:3000]
                )
            )
            
            # Parse response and add calculation details
            adjustment["calculation_details"] = response.content
            processed_adjustments.append(adjustment)
        
        state["processed_adjustments"] = processed_adjustments
        return state
    
    async def _generate_narratives(self, state: AdjustmentState) -> AdjustmentState:
        """Generate AI narratives for each adjustment"""
        parser = PydanticOutputParser(pydantic_object=AdjustmentSuggestion)
        
        final_adjustments = []
        
        for adjustment in state["processed_adjustments"]:
            prompt = ChatPromptTemplate.from_template("""
            Generate a professional narrative justification for this Quality of Earnings adjustment:
            
            Adjustment: {adjustment}
            Calculation Details: {calculation_details}
            
            Create a clear, professional narrative that explains:
            1. Why this adjustment is necessary
            2. The business rationale
            3. Impact on quality of earnings
            4. Supporting evidence
            
            {format_instructions}
            """)
            
            response = await self.llm.ainvoke(
                prompt.format(
                    adjustment=json.dumps(adjustment),
                    calculation_details=adjustment.get("calculation_details", ""),
                    format_instructions=parser.get_format_instructions()
                )
            )
            
            try:
                parsed_adjustment = parser.parse(response.content)
                final_adjustments.append(parsed_adjustment.dict())
            except Exception as e:
                # Fallback if parsing fails
                final_adjustments.append({
                    "adjustment_type": adjustment.get("type", "other"),
                    "title": adjustment.get("title", "Unknown Adjustment"),
                    "description": adjustment.get("description", ""),
                    "amount": 0.0,
                    "confidence_score": 0.5,
                    "precision_score": 0.5,
                    "narrative": response.content,
                    "source_data": adjustment,
                    "calculation_method": "Manual review required"
                })
        
        state["processed_adjustments"] = final_adjustments
        return state
    
    async def _apply_materiality(self, state: AdjustmentState) -> AdjustmentState:
        """Apply materiality thresholds to filter adjustments"""
        materiality_threshold = state["materiality_threshold"]
        materiality_percentage = state["materiality_percentage"]
        
        # Filter adjustments based on materiality
        material_adjustments = []
        for adjustment in state["processed_adjustments"]:
            amount = abs(adjustment.get("amount", 0))
            
            # Check if adjustment meets materiality thresholds
            if amount >= materiality_threshold:
                material_adjustments.append(adjustment)
            # TODO: Add percentage-based materiality check when EBITDA is available
        
        state["processed_adjustments"] = material_adjustments
        return state

# Singleton instance
adjustment_workflow = AdjustmentWorkflow()
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Chip,
  LinearProgress,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Quiz,
  CheckCircle,
  Schedule,
  Psychology,
  Send,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionnairesAPI } from '../../services/api';
import { Questionnaire, Question, QuestionResponse } from '../../types';

interface QuestionnairesViewProps {
  projectId: number;
}

const QuestionnairesView: React.FC<QuestionnairesViewProps> = ({ projectId }) => {
  const queryClient = useQueryClient();
  const [responses, setResponses] = useState<{ [key: number]: any }>({});

  // Fetch project questionnaires
  const {
    data: questionnaires = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['questionnaires', projectId],
    queryFn: () => questionnairesAPI.getProjectQuestionnaires(projectId).then((res) => res.data),
  });

  // Submit response mutation
  const submitResponseMutation = useMutation({
    mutationFn: ({ questionId, response }: { questionId: number; response: any }) =>
      questionnairesAPI.submitResponse(questionId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires', projectId] });
    },
  });

  const handleResponseChange = (questionId: number, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitResponse = (questionId: number) => {
    const response = responses[questionId];
    if (response !== undefined && response !== '') {
      submitResponseMutation.mutate({
        questionId,
        response: { response_text: response },
      });
    }
  };

  const renderQuestionInput = (question: Question) => {
    const currentResponse = responses[question.id] || '';

    switch (question.question_type) {
      case 'text':
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            variant="outlined"
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter a number..."
            variant="outlined"
          />
        );

      case 'boolean':
        return (
          <RadioGroup
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        );

      case 'multiple_choice':
        return (
          <FormControl fullWidth>
            <Select
              value={currentResponse}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select an option</em>
              </MenuItem>
              {question.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return (
          <TextField
            fullWidth
            value={currentResponse}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            variant="outlined"
          />
        );
    }
  };

  // Mock data for demonstration
  const questionnaireStats = {
    total: questionnaires.reduce((sum, q) => sum + q.questions.length, 0),
    answered: 0, // Would be calculated from actual responses
    aiGenerated: questionnaires.reduce((sum, q) => sum + q.questions.filter(qu => qu.is_ai_generated).length, 0),
    completion: 0, // Would be calculated from actual responses
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading questionnaires...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Questionnaires</Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Quiz color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{questionnaireStats.total}</Typography>
                  <Typography color="textSecondary">Total Questions</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{questionnaireStats.answered}</Typography>
                  <Typography color="textSecondary">Answered</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Psychology color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{questionnaireStats.aiGenerated}</Typography>
                  <Typography color="textSecondary">AI Generated</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{questionnaireStats.completion}%</Typography>
                  <Typography color="textSecondary">Completion</Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={questionnaireStats.completion}
                sx={{ mt: 1 }}
                color="warning"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Questionnaires */}
      {questionnaires.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Quiz sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No questionnaires available
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Questionnaires will be automatically generated based on your uploaded documents.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        questionnaires.map((questionnaire: Questionnaire) => (
          <Card key={questionnaire.id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {questionnaire.title}
              </Typography>
              {questionnaire.description && (
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  {questionnaire.description}
                </Typography>
              )}

              {questionnaire.questions.map((question: Question, index: number) => (
                <Accordion key={question.id} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {index + 1}. {question.question_text}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                        {question.is_required && (
                          <Chip label="Required" size="small" color="error" />
                        )}
                        {question.is_ai_generated && (
                          <Chip label="AI Generated" size="small" color="info" />
                        )}
                        <Chip
                          label={question.question_type.replace('_', ' ').toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mt: 2 }}>
                      {question.generated_reason && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>AI Context:</strong> {question.generated_reason}
                          </Typography>
                        </Alert>
                      )}

                      <Box sx={{ mb: 3 }}>
                        {renderQuestionInput(question)}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          startIcon={<Send />}
                          onClick={() => handleSubmitResponse(question.id)}
                          disabled={
                            !responses[question.id] ||
                            responses[question.id] === '' ||
                            submitResponseMutation.isPending
                          }
                        >
                          Submit Answer
                        </Button>
                      </Box>

                      {/* Show existing responses */}
                      {question.responses && question.responses.length > 0 && (
                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Previous Responses:
                          </Typography>
                          {question.responses.map((response: QuestionResponse) => (
                            <Box
                              key={response.id}
                              sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}
                            >
                              <Typography variant="body2">
                                {response.response_text}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                Submitted on {new Date(response.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}

              {questionnaire.questions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="textSecondary">
                    No questions in this questionnaire yet.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default QuestionnairesView;
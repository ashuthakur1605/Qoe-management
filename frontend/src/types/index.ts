// User types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: 'admin' | 'analyst';
  is_active: boolean;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  description?: string;
  client_name?: string;
  created_by: number;
  is_active: boolean;
  materiality_amount: number;
  materiality_percentage: number;
  created_at: string;
  updated_at: string;
}

// Document types
export interface Document {
  id: number;
  project_id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  document_type?: 'gl' | 'p_and_l' | 'payroll' | 'trial_balance' | 'other';
  classification_confidence?: number;
  status: 'pending' | 'processed' | 'failed';
  processing_error?: string;
  extracted_data?: any;
  raw_text?: string;
  uploaded_at: string;
  processed_at?: string;
}

// Adjustment types
export interface Adjustment {
  id: number;
  project_id: number;
  source_document_id?: number;
  created_by: number;
  adjustment_type: string;
  title: string;
  description?: string;
  amount: number;
  ai_narrative?: string;
  confidence_score?: number;
  precision_score?: number;
  status: 'suggested' | 'accepted' | 'rejected' | 'modified' | 'pending_review';
  reviewed_by?: number;
  review_notes?: string;
  is_manual: boolean;
  original_amount?: number;
  override_reason?: string;
  source_data?: any;
  calculation_method?: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
}

// Questionnaire types
export interface Question {
  id: number;
  questionnaire_id: number;
  question_text: string;
  question_type: 'text' | 'multiple_choice' | 'boolean' | 'number';
  options?: string[];
  is_required: boolean;
  order: number;
  is_ai_generated: boolean;
  generated_reason?: string;
  triggers_followup: boolean;
  followup_conditions?: any;
  created_at: string;
}

export interface QuestionResponse {
  id: number;
  question_id: number;
  user_id: number;
  response_text?: string;
  response_data?: any;
  created_at: string;
  updated_at: string;
}

export interface Questionnaire {
  id: number;
  project_id: number;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  questions: Question[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  role: 'admin' | 'analyst';
}

export interface ProjectForm {
  name: string;
  description?: string;
  client_name?: string;
  materiality_amount: number;
  materiality_percentage: number;
}

export interface AdjustmentForm {
  adjustment_type: string;
  title: string;
  description?: string;
  amount: number;
  narrative?: string;
  review_notes?: string;
}
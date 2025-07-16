import axios, { AxiosResponse } from 'axios';
import { 
  User, 
  AuthTokens, 
  LoginForm, 
  RegisterForm, 
  Project, 
  ProjectForm,
  Document,
  Adjustment,
  AdjustmentForm,
  Questionnaire
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: LoginForm): Promise<AxiosResponse<AuthTokens>> =>
    api.post('/auth/login', data),
  
  register: (data: RegisterForm): Promise<AxiosResponse<User>> =>
    api.post('/auth/register', data),
  
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getProjects: (): Promise<AxiosResponse<Project[]>> =>
    api.get('/projects'),
  
  getProject: (id: number): Promise<AxiosResponse<Project>> =>
    api.get(`/projects/${id}`),
  
  createProject: (data: ProjectForm): Promise<AxiosResponse<Project>> =>
    api.post('/projects', data),
  
  updateProject: (id: number, data: Partial<ProjectForm>): Promise<AxiosResponse<Project>> =>
    api.put(`/projects/${id}`, data),
  
  deleteProject: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/projects/${id}`),
};

// Documents API
export const documentsAPI = {
  uploadDocument: (projectId: number, file: File): Promise<AxiosResponse<Document>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/documents/upload/${projectId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getProjectDocuments: (projectId: number): Promise<AxiosResponse<Document[]>> =>
    api.get(`/documents/project/${projectId}`),
  
  getDocument: (id: number): Promise<AxiosResponse<Document>> =>
    api.get(`/documents/${id}`),
  
  deleteDocument: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/documents/${id}`),
};

// Adjustments API
export const adjustmentsAPI = {
  getProjectAdjustments: (projectId: number): Promise<AxiosResponse<Adjustment[]>> =>
    api.get(`/adjustments/project/${projectId}`),
  
  getAdjustment: (id: number): Promise<AxiosResponse<Adjustment>> =>
    api.get(`/adjustments/${id}`),
  
  createAdjustment: (projectId: number, data: AdjustmentForm): Promise<AxiosResponse<Adjustment>> =>
    api.post(`/adjustments/project/${projectId}`, data),
  
  updateAdjustment: (id: number, data: Partial<AdjustmentForm>): Promise<AxiosResponse<Adjustment>> =>
    api.put(`/adjustments/${id}`, data),
  
  reviewAdjustment: (id: number, status: string, notes?: string): Promise<AxiosResponse<Adjustment>> =>
    api.post(`/adjustments/${id}/review`, { status, notes }),
  
  deleteAdjustment: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/adjustments/${id}`),
};

// Questionnaires API
export const questionnairesAPI = {
  getProjectQuestionnaires: (projectId: number): Promise<AxiosResponse<Questionnaire[]>> =>
    api.get(`/questionnaires/project/${projectId}`),
  
  getQuestionnaire: (id: number): Promise<AxiosResponse<Questionnaire>> =>
    api.get(`/questionnaires/${id}`),
  
  submitResponse: (questionId: number, response: any): Promise<AxiosResponse<void>> =>
    api.post(`/questionnaires/questions/${questionId}/respond`, response),
};

// Reports API
export const reportsAPI = {
  generateExcelReport: (projectId: number): Promise<AxiosResponse<Blob>> =>
    api.get(`/reports/excel/${projectId}`, { responseType: 'blob' }),
  
  generateWordReport: (projectId: number): Promise<AxiosResponse<Blob>> =>
    api.get(`/reports/word/${projectId}`, { responseType: 'blob' }),
  
  getQAChecklist: (projectId: number): Promise<AxiosResponse<any>> =>
    api.get(`/reports/qa-checklist/${projectId}`),
};

export default api;
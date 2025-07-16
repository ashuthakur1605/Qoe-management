import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '../services/api';
import ProjectOverview from './project/ProjectOverview';
import DocumentsView from './project/DocumentsView';
import AdjustmentsView from './project/AdjustmentsView';
import QuestionnairesView from './project/QuestionnairesView';
import ReportsView from './project/ReportsView';
import ProjectSettings from './project/ProjectSettings';

const ProjectWorkspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Fetch project details
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsAPI.getProject(Number(projectId)).then((res) => res.data),
    enabled: !!projectId,
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading project...</Typography>
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Project not found or access denied
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Project Header */}
      <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4" component="h1">
          {project.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {project.client_name && `Client: ${project.client_name}`}
        </Typography>
        {project.description && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {project.description}
          </Typography>
        )}
      </Box>

      {/* Project Content Routes */}
      <Routes>
        <Route index element={<ProjectOverview project={project} />} />
        <Route path="documents" element={<DocumentsView projectId={Number(projectId)} />} />
        <Route path="adjustments" element={<AdjustmentsView projectId={Number(projectId)} />} />
        <Route path="questionnaires" element={<QuestionnairesView projectId={Number(projectId)} />} />
        <Route path="reports" element={<ReportsView projectId={Number(projectId)} />} />
        <Route path="settings" element={<ProjectSettings project={project} />} />
        <Route path="*" element={<Navigate to={`/projects/${projectId}`} replace />} />
      </Routes>
    </Box>
  );
};

export default ProjectWorkspace;
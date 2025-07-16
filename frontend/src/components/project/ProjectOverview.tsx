import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  UploadFile,
  Assessment,
  CheckCircle,
  Warning,
  Schedule,
  TrendingUp,
  AttachMoney,
  Description,
} from '@mui/icons-material';
import { Project } from '../../types';
import { useNavigate } from 'react-router-dom';

interface ProjectOverviewProps {
  project: Project;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Mock data for demonstration - in real app, this would come from API
  const projectStats = {
    documentsUploaded: 0,
    documentsProcessed: 0,
    adjustmentsIdentified: 0,
    adjustmentsReviewed: 0,
    questionsAnswered: 0,
    totalQuestions: 0,
    completionPercentage: 0,
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Project created',
      timestamp: project.created_at,
      type: 'info',
    },
    // More activities would be loaded from API
  ];

  const quickActions = [
    {
      title: 'Upload Documents',
      description: 'Upload financial documents for analysis',
      icon: <UploadFile />,
      action: () => navigate(`/projects/${project.id}/documents`),
      color: 'primary' as const,
    },
    {
      title: 'Review Adjustments',
      description: 'Review AI-identified adjustments',
      icon: <Assessment />,
      action: () => navigate(`/projects/${project.id}/adjustments`),
      color: 'secondary' as const,
    },
    {
      title: 'Answer Questions',
      description: 'Complete project questionnaire',
      icon: <Description />,
      action: () => navigate(`/projects/${project.id}/questionnaires`),
      color: 'info' as const,
    },
  ];

  return (
    <Box>
      {/* Project Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <UploadFile color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Documents</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {projectStats.documentsProcessed}/{projectStats.documentsUploaded}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Processed/Uploaded
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={projectStats.documentsUploaded > 0 ? (projectStats.documentsProcessed / projectStats.documentsUploaded) * 100 : 0} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment color="secondary" sx={{ mr: 2 }} />
                <Typography variant="h6">Adjustments</Typography>
              </Box>
              <Typography variant="h4" color="secondary">
                {projectStats.adjustmentsReviewed}/{projectStats.adjustmentsIdentified}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Reviewed/Identified
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={projectStats.adjustmentsIdentified > 0 ? (projectStats.adjustmentsReviewed / projectStats.adjustmentsIdentified) * 100 : 0}
                sx={{ mt: 1 }}
                color="secondary"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Description color="info" sx={{ mr: 2 }} />
                <Typography variant="h6">Questions</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {projectStats.questionsAnswered}/{projectStats.totalQuestions}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Answered/Total
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={projectStats.totalQuestions > 0 ? (projectStats.questionsAnswered / projectStats.totalQuestions) * 100 : 0}
                sx={{ mt: 1 }}
                color="info"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Typography variant="h6">Progress</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {projectStats.completionPercentage}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Overall Completion
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={projectStats.completionPercentage}
                sx={{ mt: 1 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Project Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Created Date"
                    secondary={formatDate(project.created_at)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AttachMoney />
                  </ListItemIcon>
                  <ListItemText
                    primary="Materiality Threshold"
                    secondary={`${formatCurrency(project.materiality_amount)} or ${project.materiality_percentage}%`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color={project.is_active ? 'success' : 'disabled'} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Status"
                    secondary={
                      <Chip
                        label={project.is_active ? 'Active' : 'Inactive'}
                        color={project.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ cursor: 'pointer' }} onClick={action.action}>
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 2, color: `${action.color}.main` }}>
                            {action.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2">{action.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {action.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.action}
                        secondary={formatDate(activity.timestamp)}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {recentActivity.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No recent activity"
                      secondary="Start by uploading documents or configuring project settings"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectOverview;
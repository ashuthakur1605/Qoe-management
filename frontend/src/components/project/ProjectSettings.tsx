import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Save,
  Delete,
  Person,
  Add,
  Remove,
  Settings,
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsAPI } from '../../services/api';
import { Project, ProjectForm } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectSettingsProps {
  project: Project;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ project }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProjectForm>({
    name: project.name,
    description: project.description || '',
    client_name: project.client_name || '',
    materiality_amount: project.materiality_amount,
    materiality_percentage: project.materiality_percentage,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<ProjectForm>) => projectsAPI.updateProject(project.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', project.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: () => projectsAPI.deleteProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Redirect would be handled by parent component
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const hasChanges = () => {
    return (
      formData.name !== project.name ||
      formData.description !== (project.description || '') ||
      formData.client_name !== (project.client_name || '') ||
      formData.materiality_amount !== project.materiality_amount ||
      formData.materiality_percentage !== project.materiality_percentage
    );
  };

  // Mock project team data - in real app, this would come from API
  const projectTeam = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      joinedAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'analyst',
      joinedAt: '2024-01-20',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Project Settings</Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={!hasChanges() || updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Project Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Client Name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Materiality Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Materiality Thresholds
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                Adjustments below these thresholds will be filtered out of reports.
              </Alert>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Amount Threshold ($)"
                    type="number"
                    value={formData.materiality_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, materiality_amount: Number(e.target.value) })
                    }
                    helperText="Minimum dollar amount"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Percentage Threshold (%)"
                    type="number"
                    step="0.1"
                    value={formData.materiality_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, materiality_percentage: Number(e.target.value) })
                    }
                    helperText="Percentage of EBITDA"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Thresholds:
                </Typography>
                <Typography variant="body2">
                  • Amount: {formatCurrency(formData.materiality_amount)}
                </Typography>
                <Typography variant="body2">
                  • Percentage: {formData.materiality_percentage}% of EBITDA
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Information
              </Typography>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Project ID"
                    secondary={project.id}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Created Date"
                    secondary={formatDate(project.created_at)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Updated"
                    secondary={formatDate(project.updated_at)}
                  />
                </ListItem>
                <ListItem>
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

        {/* Team Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Project Team</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  size="small"
                >
                  Add Member
                </Button>
              </Box>

              <List>
                {projectTeam.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemText
                      primary={member.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {member.email}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={member.role.toUpperCase()}
                              size="small"
                              color={member.role === 'admin' ? 'error' : 'primary'}
                            />
                            <Chip
                              label={`Joined ${formatDate(member.joinedAt)}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <Remove />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Advanced Settings
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Switch checked={project.is_active} />}
                    label="Project Active"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Inactive projects are hidden from the main dashboard
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Switch checked={true} />}
                    label="AI Suggestions Enabled"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Allow AI to suggest adjustments based on uploaded documents
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={<Switch checked={true} />}
                    label="Auto-generate Questions"
                  />
                  <Typography variant="body2" color="textSecondary">
                    Automatically generate questionnaire questions
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Danger Zone */}
        {user?.role === 'admin' && (
          <Grid item xs={12}>
            <Card sx={{ border: '1px solid', borderColor: 'error.main' }}>
              <CardContent>
                <Typography variant="h6" color="error" gutterBottom>
                  Danger Zone
                </Typography>

                <Alert severity="warning" sx={{ mb: 2 }}>
                  These actions cannot be undone. Please proceed with caution.
                </Alert>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1">Delete Project</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Permanently delete this project and all associated data including documents, adjustments, and questionnaires.
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Project
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error">Delete Project</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          
          <Typography gutterBottom>
            Are you sure you want to delete "{project.name}"?
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            This will permanently delete:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText primary="• All uploaded documents" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• All adjustments and reviews" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• All questionnaires and responses" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• All project settings and configurations" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectSettings;
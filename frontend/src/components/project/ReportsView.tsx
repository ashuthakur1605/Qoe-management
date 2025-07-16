import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  PictureAsPdf,
  TableChart,
  Download,
  CheckCircle,
  Warning,
  Cancel,
  Preview,
  Assessment,
} from '@mui/icons-material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { reportsAPI } from '../../services/api';

interface ReportsViewProps {
  projectId: number;
}

const ReportsView: React.FC<ReportsViewProps> = ({ projectId }) => {
  const [qaDialogOpen, setQaDialogOpen] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  // Fetch QA checklist
  const {
    data: qaChecklist,
    isLoading: qaLoading,
  } = useQuery({
    queryKey: ['qa-checklist', projectId],
    queryFn: () => reportsAPI.getQAChecklist(projectId).then((res) => res.data),
  });

  // Generate Excel report mutation
  const generateExcelMutation = useMutation({
    mutationFn: () => reportsAPI.generateExcelReport(projectId),
    onSuccess: (response) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qoe-report-${projectId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setGenerating(null);
    },
    onError: () => {
      setGenerating(null);
    },
  });

  // Generate Word report mutation
  const generateWordMutation = useMutation({
    mutationFn: () => reportsAPI.generateWordReport(projectId),
    onSuccess: (response) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qoe-report-${projectId}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setGenerating(null);
    },
    onError: () => {
      setGenerating(null);
    },
  });

  const handleGenerateExcel = () => {
    if (!isReadyForReport()) {
      setQaDialogOpen(true);
      return;
    }
    setGenerating('excel');
    generateExcelMutation.mutate();
  };

  const handleGenerateWord = () => {
    if (!isReadyForReport()) {
      setQaDialogOpen(true);
      return;
    }
    setGenerating('word');
    generateWordMutation.mutate();
  };

  // Mock QA checklist - in real app, this would come from API
  const mockQaChecklist = [
    {
      id: 1,
      item: 'All documents have been uploaded and processed',
      status: 'complete',
      required: true,
    },
    {
      id: 2,
      item: 'AI-suggested adjustments have been reviewed',
      status: 'pending',
      required: true,
    },
    {
      id: 3,
      item: 'Manual adjustments have narratives',
      status: 'complete',
      required: true,
    },
    {
      id: 4,
      item: 'Questionnaire responses are complete',
      status: 'pending',
      required: false,
    },
    {
      id: 5,
      item: 'Materiality thresholds are confirmed',
      status: 'complete',
      required: true,
    },
    {
      id: 6,
      item: 'All adjustments have been categorized',
      status: 'complete',
      required: true,
    },
  ];

  const checklist = qaChecklist || mockQaChecklist;

  const isReadyForReport = () => {
    return checklist
      .filter(item => item.required)
      .every(item => item.status === 'complete');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Warning color="warning" />;
      case 'failed':
        return <Cancel color="error" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const reportStats = {
    completedItems: checklist.filter(item => item.status === 'complete').length,
    totalItems: checklist.length,
    requiredCompleted: checklist.filter(item => item.required && item.status === 'complete').length,
    totalRequired: checklist.filter(item => item.required).length,
  };

  const completionPercentage = (reportStats.completedItems / reportStats.totalItems) * 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Reports</Typography>
      </Box>

      {/* Status Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{Math.round(completionPercentage)}%</Typography>
                  <Typography color="textSecondary">Overall Progress</Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {reportStats.requiredCompleted}/{reportStats.totalRequired}
                  </Typography>
                  <Typography color="textSecondary">Required Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isReadyForReport() ? (
                  <CheckCircle color="success" sx={{ mr: 2, fontSize: 40 }} />
                ) : (
                  <Warning color="warning" sx={{ mr: 2, fontSize: 40 }} />
                )}
                <Box>
                  <Typography variant="h6">
                    {isReadyForReport() ? 'Ready' : 'Not Ready'}
                  </Typography>
                  <Typography color="textSecondary">Report Generation</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* QA Checklist */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                QA Checklist
              </Typography>
              
              {!isReadyForReport() && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Complete all required items before generating reports.
                </Alert>
              )}

              <List>
                {checklist.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(item.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.item}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              label={item.status.toUpperCase()}
                              size="small"
                              color={getStatusColor(item.status)}
                            />
                            {item.required && (
                              <Chip label="Required" size="small" color="error" variant="outlined" />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < checklist.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Generation */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate Reports
              </Typography>

              <Grid container spacing={2}>
                {/* Excel Report */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TableChart color="success" sx={{ mr: 2, fontSize: 40 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">Excel Data Book</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Comprehensive Excel workbook with all financial data, adjustments, and calculations
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Includes:
                        </Typography>
                        <List dense>
                          <ListItem disablePadding>
                            <ListItemText primary="• Formula-linked financial sheets" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• GL summary and source mapping" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• Adjustment details and calculations" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• Supporting documentation references" />
                          </ListItem>
                        </List>
                      </Box>

                      <Button
                        variant="contained"
                        color="success"
                        startIcon={generating === 'excel' ? undefined : <Download />}
                        onClick={handleGenerateExcel}
                        disabled={generating !== null}
                        fullWidth
                      >
                        {generating === 'excel' ? 'Generating...' : 'Generate Excel Report'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Word/PDF Report */}
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PictureAsPdf color="error" sx={{ mr: 2, fontSize: 40 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6">Word/PDF Report</Typography>
                          <Typography variant="body2" color="textSecondary">
                            Professional QoE report formatted according to client template
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Includes:
                        </Typography>
                        <List dense>
                          <ListItem disablePadding>
                            <ListItemText primary="• Executive summary" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• Detailed adjustment narratives" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• Supporting analysis and calculations" />
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemText primary="• Appendices with source documents" />
                          </ListItem>
                        </List>
                      </Box>

                      <Button
                        variant="contained"
                        color="error"
                        startIcon={generating === 'word' ? undefined : <Download />}
                        onClick={handleGenerateWord}
                        disabled={generating !== null}
                        fullWidth
                      >
                        {generating === 'word' ? 'Generating...' : 'Generate Word Report'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* QA Warning Dialog */}
      <Dialog open={qaDialogOpen} onClose={() => setQaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Generation Blocked</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You cannot generate reports until all required QA checklist items are completed.
          </Alert>
          
          <Typography variant="h6" gutterBottom>
            Incomplete Required Items:
          </Typography>
          
          <List>
            {checklist
              .filter(item => item.required && item.status !== 'complete')
              .map(item => (
                <ListItem key={item.id}>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={item.item} />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQaDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsView;
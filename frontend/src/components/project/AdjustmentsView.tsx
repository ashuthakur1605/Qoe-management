import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Rating,
  Collapse,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Edit,
  ExpandMore,
  ExpandLess,
  Add,
  Assessment,
  Psychology,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adjustmentsAPI } from '../../services/api';
import { Adjustment, AdjustmentForm } from '../../types';

interface AdjustmentsViewProps {
  projectId: number;
}

const AdjustmentsView: React.FC<AdjustmentsViewProps> = ({ projectId }) => {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<Adjustment | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newAdjustment, setNewAdjustment] = useState<AdjustmentForm>({
    adjustment_type: '',
    title: '',
    description: '',
    amount: 0,
    narrative: '',
    review_notes: '',
  });

  // Fetch project adjustments
  const {
    data: adjustments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adjustments', projectId],
    queryFn: () => adjustmentsAPI.getProjectAdjustments(projectId).then((res) => res.data),
  });

  // Review adjustment mutation
  const reviewMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) =>
      adjustmentsAPI.reviewAdjustment(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adjustments', projectId] });
      setReviewDialogOpen(false);
      setSelectedAdjustment(null);
      setReviewNotes('');
    },
  });

  // Create adjustment mutation
  const createMutation = useMutation({
    mutationFn: (data: AdjustmentForm) => adjustmentsAPI.createAdjustment(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adjustments', projectId] });
      setCreateDialogOpen(false);
      setNewAdjustment({
        adjustment_type: '',
        title: '',
        description: '',
        amount: 0,
        narrative: '',
        review_notes: '',
      });
    },
  });

  const handleReview = (adjustment: Adjustment) => {
    setSelectedAdjustment(adjustment);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = (status: string) => {
    if (!selectedAdjustment) return;
    reviewMutation.mutate({
      id: selectedAdjustment.id,
      status,
      notes: reviewNotes,
    });
  };

  const handleCreateAdjustment = () => {
    createMutation.mutate(newAdjustment);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'modified':
        return 'info';
      case 'pending_review':
        return 'warning';
      case 'suggested':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const adjustmentTypes = [
    'executive_compensation',
    'severance',
    'one_time_revenue',
    'depreciation',
    'stock_compensation',
    'litigation_costs',
    'restructuring',
    'acquisition_costs',
    'ipo_costs',
    'consultant_fees',
    'travel_entertainment',
    'rent_normalization',
    'related_party',
    'insurance_normalization',
    'bad_debt',
    'inventory_adjustment',
    'warranty_reserve',
    'accrual_adjustment',
    'accounting_policy',
    'seasonal_adjustment',
    'customer_concentration',
    'supplier_concentration',
    'contract_adjustment',
    'revenue_recognition',
    'cost_allocation',
    'asset_impairment',
    'tax_adjustment',
    'other',
  ];

  // Filter adjustments by status
  const filterAdjustments = (status?: string) => {
    if (!status) return adjustments;
    return adjustments.filter((adj: Adjustment) => adj.status === status);
  };

  const tabData = [
    { label: 'All', count: adjustments.length, adjustments: adjustments },
    { label: 'Suggested', count: filterAdjustments('suggested').length, adjustments: filterAdjustments('suggested') },
    { label: 'Pending Review', count: filterAdjustments('pending_review').length, adjustments: filterAdjustments('pending_review') },
    { label: 'Accepted', count: filterAdjustments('accepted').length, adjustments: filterAdjustments('accepted') },
    { label: 'Rejected', count: filterAdjustments('rejected').length, adjustments: filterAdjustments('rejected') },
  ];

  const adjustmentStats = {
    total: adjustments.length,
    suggested: filterAdjustments('suggested').length,
    accepted: filterAdjustments('accepted').length,
    rejected: filterAdjustments('rejected').length,
    totalAmount: adjustments.reduce((sum: number, adj: Adjustment) => sum + adj.amount, 0),
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Adjustments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Manual Adjustment
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{adjustmentStats.total}</Typography>
                  <Typography color="textSecondary">Total Adjustments</Typography>
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
                  <Typography variant="h4">{adjustmentStats.suggested}</Typography>
                  <Typography color="textSecondary">AI Suggested</Typography>
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
                  <Typography variant="h4">{adjustmentStats.accepted}</Typography>
                  <Typography color="textSecondary">Accepted</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{formatCurrency(adjustmentStats.totalAmount)}</Typography>
                  <Typography color="textSecondary">Total Impact</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Adjustments Table */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
              {tabData.map((tab, index) => (
                <Tab
                  key={index}
                  label={`${tab.label} (${tab.count})`}
                />
              ))}
            </Tabs>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Adjustment</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Confidence</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tabData[selectedTab].adjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          No adjustments found in this category.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  tabData[selectedTab].adjustments.map((adjustment: Adjustment) => (
                    <React.Fragment key={adjustment.id}>
                      <TableRow hover>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{adjustment.title}</Typography>
                            {adjustment.description && (
                              <Typography variant="caption" color="textSecondary">
                                {adjustment.description.substring(0, 100)}...
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={adjustment.adjustment_type.replace('_', ' ').toUpperCase()}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(adjustment.amount)}
                          </Typography>
                          {adjustment.is_manual && (
                            <Chip label="Manual" size="small" color="info" />
                          )}
                        </TableCell>
                        <TableCell>
                          {adjustment.confidence_score && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating
                                value={adjustment.confidence_score}
                                max={1}
                                precision={0.1}
                                size="small"
                                readOnly
                              />
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                {Math.round(adjustment.confidence_score * 100)}%
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={adjustment.status.replace('_', ' ').toUpperCase()}
                            color={getStatusColor(adjustment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(adjustment.created_at)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setExpandedRow(expandedRow === adjustment.id ? null : adjustment.id)
                              }
                            >
                              {expandedRow === adjustment.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                            {adjustment.status === 'suggested' && (
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleReview(adjustment)}
                              >
                                <Edit />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0 }}>
                          <Collapse in={expandedRow === adjustment.id}>
                            <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                  <Typography variant="h6" gutterBottom>
                                    AI Narrative
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 2 }}>
                                    {adjustment.ai_narrative || 'No narrative available'}
                                  </Typography>
                                  
                                  <Typography variant="h6" gutterBottom>
                                    Calculation Method
                                  </Typography>
                                  <Typography variant="body2">
                                    {adjustment.calculation_method || 'Manual calculation'}
                                  </Typography>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                  <Typography variant="h6" gutterBottom>
                                    Review Information
                                  </Typography>
                                  {adjustment.review_notes && (
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                      <strong>Notes:</strong> {adjustment.review_notes}
                                    </Typography>
                                  )}
                                  
                                  {adjustment.reviewed_at && (
                                    <Typography variant="body2">
                                      <strong>Reviewed:</strong> {formatDate(adjustment.reviewed_at)}
                                    </Typography>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Review Adjustment</DialogTitle>
        <DialogContent>
          {selectedAdjustment && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedAdjustment.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedAdjustment.description}
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Amount: {formatCurrency(selectedAdjustment.amount)} | 
                Confidence: {Math.round((selectedAdjustment.confidence_score || 0) * 100)}%
              </Alert>

              <Typography variant="subtitle1" gutterBottom>
                AI Narrative:
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                {selectedAdjustment.ai_narrative}
              </Typography>

              <TextField
                fullWidth
                label="Review Notes"
                multiline
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add your review notes here..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleReviewSubmit('rejected')}
            color="error"
            variant="outlined"
          >
            Reject
          </Button>
          <Button
            onClick={() => handleReviewSubmit('accepted')}
            color="success"
            variant="contained"
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Manual Adjustment Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Manual Adjustment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Adjustment Type</InputLabel>
                <Select
                  value={newAdjustment.adjustment_type}
                  onChange={(e) =>
                    setNewAdjustment({ ...newAdjustment, adjustment_type: e.target.value })
                  }
                >
                  {adjustmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newAdjustment.title}
                onChange={(e) => setNewAdjustment({ ...newAdjustment, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newAdjustment.description}
                onChange={(e) =>
                  setNewAdjustment({ ...newAdjustment, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount ($)"
                type="number"
                value={newAdjustment.amount}
                onChange={(e) =>
                  setNewAdjustment({ ...newAdjustment, amount: Number(e.target.value) })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Narrative"
                multiline
                rows={4}
                value={newAdjustment.narrative}
                onChange={(e) =>
                  setNewAdjustment({ ...newAdjustment, narrative: e.target.value })
                }
                placeholder="Provide justification for this adjustment..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateAdjustment}
            variant="contained"
            disabled={!newAdjustment.title || !newAdjustment.adjustment_type}
          >
            Create Adjustment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdjustmentsView;
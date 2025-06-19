import React from 'react';
import { 
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Rating,
  Avatar,
  Chip,
  Grid,
  useTheme
} from '@mui/material';
import {
  Reviews as ReviewsIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  DateRange as DateIcon
} from '@mui/icons-material';

const ProviderReviews = () => {
  const theme = useTheme();
  const greenColor = '#147c3c';
  const greenHover = '#126e35';

  const reviews = [
    {
      id: 1,
      customer: 'Alex Johnson',
      rating: 5,
      date: '2025-06-15',
      comment: 'Excellent service! Fixed my plumbing issue quickly and professionally.',
      service: 'Pipe Repair'
    },
    {
      id: 2,
      customer: 'Sarah Miller',
      rating: 4,
      date: '2025-06-10',
      comment: 'Good work but arrived 15 minutes later than scheduled.',
      service: 'Faucet Installation'
    },
    {
      id: 3,
      customer: 'Michael Chen',
      rating: 5,
      date: '2025-06-05',
      comment: 'Highly recommend! Solved a complex issue other plumbers couldn\'t fix.',
      service: 'Water Heater Repair'
    }
  ];

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      backgroundColor: '#f5f5f5', // light gray
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <ReviewsIcon sx={{ fontSize: 32, color: greenColor }} />
        <Typography variant="h5" fontWeight={600}>
          Customer Reviews
        </Typography>
      </Stack>

      {/* Summary */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Average Rating
            </Typography>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
              <Rating
                value={averageRating}
                precision={0.1}
                readOnly
                sx={{ color: theme.palette.warning.main }}
              />
              <Typography variant="h4" fontWeight={600}>
                {averageRating.toFixed(1)}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              from {reviews.length} reviews
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              5-Star Reviews
            </Typography>
            <Typography variant="h4" fontWeight={600} sx={{ color: greenColor }}>
              {reviews.filter(r => r.rating === 5).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}% of total
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Recent Feedback
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {reviews[0].rating}/5
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              "{reviews[0].comment.substring(0, 30)}..."
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Review List */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          All Reviews
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {reviews.map((review) => (
            <Box key={review.id} sx={{ p: 2, borderRadius: 1 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar sx={{ bgcolor: greenColor }}>
                  {review.customer.charAt(0)}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" justifyContent="space-between" flexWrap="wrap">
                    <Typography fontWeight={600}>{review.customer}</Typography>
                    <Chip
                      icon={<DateIcon fontSize="small" />}
                      label={new Date(review.date).toLocaleDateString()}
                      size="small"
                      variant="outlined"
                      sx={{ color: greenColor, borderColor: greenColor }}
                    />
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} my={1}>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      icon={<StarIcon fontSize="inherit" />}
                      sx={{ color: theme.palette.warning.main }}
                    />
                    <Chip
                      label={review.service}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: greenColor,
                        borderColor: greenColor,
                        '&:hover': { backgroundColor: greenHover },
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <CommentIcon color="disabled" fontSize="small" sx={{ mt: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProviderReviews;

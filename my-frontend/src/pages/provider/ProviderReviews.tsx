import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Rating,
  Avatar,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Reviews as ReviewsIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Review {
  id: number;
  customer: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
}

interface ApiReview {
  id: number;
  user_name: string;
  provider_name: string;
  service_name: string;
  rating: number;
  reviews: string;
  date: string;
}

interface ApiResponse {
  data: ApiReview[];
}

const ProviderReviews: React.FC = () => {
  const theme = useTheme();
  const greenColor = '#147c3c';
  const greenHover = '#126e35';

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get<ApiResponse>('http://localhost:8000/api/ratings', {
          withCredentials: true,
        });

        if (response.data && Array.isArray(response.data.data)) {
          const transformedData = response.data.data.map(r => ({
            id: r.id,
            customer: r.user_name,
            rating: r.rating,
            date: r.date,
            comment: r.reviews,
            service: r.service_name,
          }));
          setReviews(transformedData);
        } else {
          console.warn("API response was not in the expected format:", response);
          setReviews([]);
          setError('Received an unexpected format from the server.');
        }
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError(err.response?.data?.error || 'Failed to fetch reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Summary */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: 340 }}>
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
              {reviews.length > 0 ? `from ${reviews.length} reviews` : 'No reviews yet'}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: 340 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              5-Star Reviews
            </Typography>
            <Typography variant="h4" fontWeight={600} sx={{ color: greenColor }}>
              {reviews.filter(r => r.rating === 5).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {reviews.length > 0 ? `${Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}% of total` : 'N/A'}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: 340 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Recent Feedback
            </Typography>
            {reviews.length > 0 ? (
              <>
                <Typography variant="h4" fontWeight={600}>
                  {reviews[0].rating}/5
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  "{reviews[0].comment.substring(0, 30)}..."
                </Typography>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary">No recent feedback</Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Review List */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          All Reviews
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
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
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
              You have no reviews yet.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProviderReviews;

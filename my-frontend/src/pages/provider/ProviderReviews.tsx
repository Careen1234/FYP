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
  Alert,
  Grid,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  Reviews as ReviewsIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  DateRange as DateIcon,
  EmojiEvents as TopRatedIcon,
  SentimentSatisfiedAlt as PositiveIcon,
  RateReview as RecentIcon
} from '@mui/icons-material';
import axios from 'axios';

interface Review {
  id: number;
  customer: string;
  provider: string;
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
  review: string;
  date: string;
}

interface ApiResponse {
  data: ApiReview[];
}

const ProviderReviews: React.FC = () => {
  const theme = useTheme();
  const greenColor = '#147c3c';
  const lightGreen = '#e0f2e9';

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
            customer: r.user_name || 'Unknown',
            provider: r.provider_name || 'Unknown',
            rating: r.rating ?? 0,
            date: r.date || '',
            comment: r.review || '',
            service: r.service_name || 'Unspecified',
          }));
          setReviews(transformedData);
        } else {
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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const fiveStarPercent = reviews.length > 0 
    ? Math.round((fiveStarCount / reviews.length) * 100) 
    : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
        <Box sx={{
          backgroundColor: 'rgba(20, 124, 60, 0.1)',
          width: 48,
          height: 48,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ReviewsIcon sx={{ fontSize: 28, color: greenColor }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#0d5a2c">
            Customer Reviews
          </Typography>
          <Typography variant="body2" color="#64748b">
            See what your customers are saying about your services
          </Typography>
        </Box>
      </Stack>

      {error && (
        <Paper sx={{ 
          backgroundColor: '#fef2f2', 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          borderLeft: '4px solid #ef4444'
        }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {/* Average Rating */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
            height: '100%',
            textAlign: 'center'
          }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: lightGreen,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <StarIcon sx={{ color: greenColor, fontSize: 28 }} />
            </Box>
            <Typography variant="subtitle1" color="#64748b" mb={1}>
              Average Rating
            </Typography>
            {loading ? (
              <Skeleton variant="text" width="40%" height={50} sx={{ mx: 'auto' }} />
            ) : (
              <>
                <Rating
                  value={averageRating}
                  precision={0.1}
                  readOnly
                  sx={{ 
                    color: theme.palette.warning.main,
                    mb: 1.5
                  }}
                />
                <Typography variant="h3" fontWeight={700} color="#0d5a2c">
                  {averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  {reviews.length > 0 ? `from ${reviews.length} reviews` : 'No reviews yet'}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* 5-Star Reviews */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
            height: '100%',
            textAlign: 'center'
          }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: lightGreen,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <TopRatedIcon sx={{ color: greenColor, fontSize: 28 }} />
            </Box>
            <Typography variant="subtitle1" color="#64748b" mb={1}>
              5-Star Reviews
            </Typography>
            {loading ? (
              <Skeleton variant="text" width="40%" height={50} sx={{ mx: 'auto' }} />
            ) : (
              <>
                <Typography variant="h3" fontWeight={700} color="#0d5a2c">
                  {fiveStarCount}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  {reviews.length > 0 ? `${fiveStarPercent}% of total` : 'N/A'}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Recent Feedback */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            backgroundColor: '#fff',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.05)',
            height: '100%',
            textAlign: 'center'
          }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: lightGreen,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <RecentIcon sx={{ color: greenColor, fontSize: 28 }} />
            </Box>
            <Typography variant="subtitle1" color="#64748b" mb={1}>
              Recent Feedback
            </Typography>
            {loading ? (
              <Skeleton variant="text" width="70%" height={50} sx={{ mx: 'auto' }} />
            ) : reviews.length > 0 ? (
              <>
                <Typography variant="h3" fontWeight={700} color="#0d5a2c">
                  {reviews[0].rating}/5
                </Typography>
                <Typography variant="body2" color="#64748b" mt={1} noWrap>
                  {reviews[0].comment
                    ? `"${reviews[0].comment.substring(0, 30)}..."`
                    : 'No recent comment'}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="#64748b">
                No recent feedback
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Review List */}
      <Paper sx={{ 
        p: { xs: 2, md: 3 }, 
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        backgroundColor: '#fff'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight={700} color="#0d5a2c">
            All Reviews
          </Typography>
          <Chip 
            label={`${reviews.length} total`} 
            size="small" 
            sx={{ 
              backgroundColor: lightGreen,
              color: greenColor,
              fontWeight: 600
            }} 
          />
        </Stack>
        <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

        {loading ? (
          <Box>
            {[0, 1, 2].map((i) => (
              <Paper key={i} sx={{ p: 3, mb: 3, borderRadius: 3, backgroundColor: '#f8fafc' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm="auto">
                    <Skeleton variant="circular" width={60} height={60} />
                  </Grid>
                  <Grid item xs={12} sm>
                    <Box mb={1.5}>
                      <Skeleton variant="text" width="40%" height={30} />
                    </Box>
                    <Box mb={1.5}>
                      <Skeleton variant="text" width="60%" height={25} />
                    </Box>
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        ) : reviews.length > 0 ? (
          <Stack spacing={3}>
            {reviews.map((review) => (
              <Paper key={review.id} sx={{ 
                p: 3, 
                borderRadius: 3,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm="auto">
                    <Avatar 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        bgcolor: greenColor,
                        fontSize: 24
                      }}
                    >
                      {review.customer.charAt(0)}
                    </Avatar>
                  </Grid>
                  
                  <Grid item xs={12} sm>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mb={1.5}>
                      <Typography fontWeight={700} color="#0d5a2c">
                        {review.customer}
                      </Typography>
                      <Chip
                        icon={<DateIcon fontSize="small" />}
                        label={new Date(review.date).toLocaleDateString()}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          color: greenColor, 
                          borderColor: greenColor,
                          mt: { xs: 1, sm: 0 }
                        }}
                      />
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
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
                          backgroundColor: lightGreen,
                          fontWeight: 500
                        }}
                      />
                    </Stack>
                    
                    {review.comment && (
                      <Paper sx={{ 
                        p: 2, 
                        backgroundColor: '#fff', 
                        borderRadius: 2,
                        borderLeft: `3px solid ${greenColor}`
                      }}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <CommentIcon sx={{ color: '#94a3b8', mt: 0.5 }} />
                          <Typography variant="body1" color="#334155">
                            {review.comment}
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: '#f8fafc',
            borderRadius: 3
          }}>
            <PositiveIcon sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} color="#64748b" mb={1}>
              No Reviews Yet
            </Typography>
            <Typography variant="body1" color="#94a3b8">
              Your reviews will appear here once customers rate your services
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ProviderReviews;
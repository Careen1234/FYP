import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { BarChart, LineChart, PieChart, DoughnutChart } from './Charts'; // Assume these are custom chart components

const ReportsAndAnalytics: React.FC = () => {
  const [summary, setSummary] = useState({
    users: 0,
    providers: 0,
    bookings: 0,
    revenue: 0,
    payments: 0
  });

  const [filters, setFilters] = useState({
    dateRange: 'monthly',
    service: '',
  });

  useEffect(() => {
    fetchSummaryData();
  }, [filters]);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get('/api/analytics/summary', { params: filters });
      setSummary(response.data as {
        users: number;
        providers: number;
        bookings: number;
        revenue: number;
        payments: number;
      });
    } catch (error) {
      console.error('Failed to fetch summary data:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        {[ 
          { title: 'Users', value: summary.users },
          { title: 'Providers', value: summary.providers },
          { title: 'Bookings', value: summary.bookings },
          { title: 'Revenue ($)', value: summary.revenue },
          { title: 'Payments', value: summary.payments },
        ].map((item) => (
          <Card key={item.title} sx={{ flex: '1 1 200px' }}>
            <CardContent>
              <Typography variant="h6">{item.title}</Typography>
              <Typography variant="h5">{item.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters */}
      <Box mb={3} display="flex" flexWrap="wrap" gap={2}>
        <TextField
          select
          label="Date Range"
          name="dateRange"
          value={filters.dateRange}
          onChange={handleFilterChange}
          sx={{ width: '200px' }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </TextField>
        <TextField
          label="Service Category"
          name="service"
          value={filters.service}
          onChange={handleFilterChange}
          sx={{ width: '250px' }}
        />
      </Box>

      {/* Charts */}
      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex={1} minWidth={300}>
          <LineChart title="Bookings Over Time" dataKey="bookings" />
        </Box>
        <Box flex={1} minWidth={300}>
          <BarChart title="Revenue by Service" dataKey="revenue" />
        </Box>
        <Box flex={1} minWidth={300}>
          <PieChart title="Payment Method Distribution" />
        </Box>
        <Box flex={1} minWidth={300}>
          <DoughnutChart title="Booking Status Breakdown" />
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsAndAnalytics;

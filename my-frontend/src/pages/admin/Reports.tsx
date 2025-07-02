import React, { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, TextField, Button, Stack } from '@mui/material';
import axios from 'axios';
import { BarChart, LineChart, PieChart, DoughnutChart } from './Charts'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Filters = {
  dateRange: 'daily' | 'weekly' | 'monthly';
  service: string;
};

type AnalyticsData = {
  bookingsOverTime: any[];
  revenueByService: any[];
  paymentMethods: any[];
  bookingStatus: any[];
};

const Reports: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: 'monthly',
    service: '',
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    bookingsOverTime: [],
    revenueByService: [],
    paymentMethods: [],
    bookingStatus: [],
  });

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found.');
        return;
      }
      const response = await axios.get('/api/analytics/data', {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalyticsData(response.data as AnalyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Date,Bookings\n';
    analyticsData.bookingsOverTime.forEach(item => {
      csvContent += `${item.date},${item.bookings}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `report_${filters.dateRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Report - ${filters.dateRange}`, 14, 20);

    const tableColumn = ['Date', 'Bookings'];
    const tableRows = analyticsData.bookingsOverTime.map(item => [
      item.date,
      item.bookings,
    ]);

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`report_${filters.dateRange}.pdf`);
  };

  return (
    <Box p={5}>
      <Typography variant="h4" sx={{ color: '#147c3c', mb: 3 }} gutterBottom>
        Reports & Analytics
      </Typography>

      <Stack direction="row" spacing={2} mb={4} alignItems="center">
        <TextField
          select
          label="Date Range"
          name="dateRange"
          value={filters.dateRange}
          onChange={handleFilterChange}
          sx={{ width: 200 }}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
        </TextField>


        <Button variant="outlined" onClick={exportCSV} sx={{ ml: 3 }}>
          Export CSV
        </Button>
        <Button variant="outlined" onClick={exportPDF}>
          Export PDF
        </Button>
      </Stack>

      <Box display="flex" flexWrap="wrap" gap={3}>
        <Box flex={1} minWidth={300}>
          <LineChart
            title="Bookings Over Time"
            dataKey="bookings"
          />
        </Box>

        <Box flex={1} minWidth={300}>
          <BarChart
            title="Revenue by Service"
            data={analyticsData.revenueByService}
            dataKey="revenue"
            xKey="service"
          />
        </Box>

        <Box flex={1} minWidth={300}>
          <PieChart
            title="Payment Method Distribution"
            data={analyticsData.paymentMethods}
            dataKey="count"
            nameKey="method"
          />
        </Box>

        <Box flex={1} minWidth={300}>
          <DoughnutChart
            title="Booking Status Breakdown"
            data={analyticsData.bookingStatus}
            dataKey="count"
            nameKey="status"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;

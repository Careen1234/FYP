import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Booking = {
  client_name: string;
  date: string;
  location: string;
  payment: number;
};

type ReportData = {
  bookings: Booking[];
  total_customers: number;
  total_income: number;
};

const ProviderReport: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [from, setFrom] = useState<string>('2025-06-01');
  const [to, setTo] = useState<string>('2025-07-01');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(false);
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:8000/api/provider/reports', {
        headers: { Authorization: `Bearer ${token}` },
        params: { from, to },
      });

      setReportData(res.data);
    } catch (err) {
      console.error('Failed to fetch provider report:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  const exportToPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor('#147c3c');
    doc.text('Provider Detailed Report', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Client', 'Date', 'Location', 'Payment (TZS)']],
      body: reportData.bookings.map(b => [
        b.client_name,
        b.date,
        b.location,
        b.payment.toLocaleString(),
      ]),
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text(`Total Customers: ${reportData.total_customers}`, 14, finalY + 10);
    doc.text(`Total Income (TZS): ${reportData.total_income.toLocaleString()}`, 14, finalY + 20);

    doc.save('provider_report.pdf');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" sx={{ color: '#147c3c', mb: 3 }}>
        Provider Detailed Report
      </Typography>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleFilterSubmit}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
            <TextField
              label="From"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="To"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#147c3c' }}
            >
              Filter
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Report Content */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Failed to load report data.</Typography>
      ) : reportData ? (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Bookings
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Payment (TZS)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.bookings.map((b, idx) => (
                <TableRow key={idx}>
                  <TableCell>{b.client_name}</TableCell>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{b.location}</TableCell>
                  <TableCell>{b.payment.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box mt={3}>
            <Typography variant="h6">
              Total Customers Served: {reportData.total_customers}
            </Typography>
            <Typography variant="h6">
              Total Income: {reportData.total_income.toLocaleString()} TZS
            </Typography>
          </Box>

          <Box mt={2}>
            <Button
              onClick={exportToPDF}
              variant="outlined"
              sx={{
                borderColor: '#147c3c',
                color: '#147c3c',
                '&:hover': {
                  backgroundColor: '#147c3c',
                  color: 'white',
                },
              }}
            >
              Export PDF
            </Button>
          </Box>
        </Paper>
      ) : (
        <Typography>No report data available.</Typography>
      )}
    </Box>
  );
};

export default ProviderReport;

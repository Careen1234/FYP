import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
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

    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text(`Total Customers: ${reportData.total_customers}`, 14, finalY + 10);
    doc.text(`Total Income (TZS): ${reportData.total_income.toLocaleString()}`, 14, finalY + 20);

    doc.save('provider_report.pdf');
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#147c3c',
          mb: 3,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        Provider Detailed Report
      </Typography>

      {/* Filters */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
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
              sx={{
                backgroundColor: '#147c3c',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  backgroundColor: '#106d32',
                },
              }}
            >
              Filter
            </Button>
          </Stack>
        </form>
      </Paper>

      {/* Report Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography
          color="error"
          sx={{
            backgroundColor: '#fff0f0',
            border: '1px solid #fca5a5',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
          }}
        >
          Failed to load report data.
        </Typography>
      ) : reportData ? (
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: '#0f172a' }}
          >
            Bookings
          </Typography>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Client Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment (TZS)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.bookings.map((b, idx) => (
                <TableRow
                  key={idx}
                  hover
                  sx={{
                    transition: 'background 0.2s',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                    },
                  }}
                >
                  <TableCell>{b.client_name}</TableCell>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{b.location}</TableCell>
                  <TableCell>{b.payment.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box mt={3}>
            <Typography variant="subtitle1" fontWeight={600}>
              Total Customers Served: {reportData.total_customers}
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              Total Income: {reportData.total_income.toLocaleString()} TZS
            </Typography>
          </Box>

          <Box mt={3} textAlign="right">
            <Button
              onClick={exportToPDF}
              variant="outlined"
              sx={{
                borderColor: '#147c3c',
                color: '#147c3c',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#147c3c',
                  color: 'white',
                  borderColor: '#106d32',
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

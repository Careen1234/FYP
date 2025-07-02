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

// Updated Booking type to match new backend fields
type Booking = {
  provider_name: string;
  service: string;
 // payment: number;
 // review: string | null;
  rating: number | null;
  date: string;
};

type ReportData = {
  bookings: Booking[];
  total_bookings: number;
  //total_paid: number;
};

const Report: React.FC = () => {
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

      const res = await axios.get<ReportData>('http://localhost:8000/api/user/reports', {
        headers: { Authorization: `Bearer ${token}` },
        params: { from, to },
      });

      setReportData(res.data);
    } catch (err) {
      console.error('Failed to fetch user report:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line
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
    doc.text('User Booking Report', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Provider', 'Service', 'Rating', 'Date']],
      body: reportData.bookings.map(b => [
        b.provider_name,
        b.service,
       // b.payment.toLocaleString(),
        
        b.rating ?? '',
        b.date,
      ]),
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY || 40;
    doc.setFontSize(14);
    doc.text(`Total Bookings: ${reportData.total_bookings}`, 14, finalY + 10);


    doc.save('user_report.pdf');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" sx={{ color: '#147c3c', mb: 3 }}>
        User Booking Report
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
                <TableCell>Provider</TableCell>
                <TableCell>Service</TableCell>
              
                
                <TableCell>Rating</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.bookings.map((b, idx) => (
                <TableRow key={idx}>
                  <TableCell>{b.provider_name}</TableCell>
                  <TableCell>{b.service}</TableCell>
                  <TableCell>{b.rating ?? ''}</TableCell>
                  <TableCell>{b.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box mt={3}>
            <Typography variant="h6">
              Total Bookings: {reportData.total_bookings}
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

export default Report;

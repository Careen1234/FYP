import React, { useState /*, useEffect */ } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
// import axios from 'axios';

interface Payment {
  id: number;
  userName: string;
  providerName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paidAt: string;
}

const initialFormData = {
  userId: '',
  providerId: '',
  bookingId: '',
  amount: '',
  paymentMethod: '',
  status: 'paid',
  transactionId: '',
};

const PaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      userName: 'Jane Doe',
      providerName: 'John Services',
      amount: 50000,
      paymentMethod: 'mobile_money',
      status: 'paid',
      paidAt: '2025-05-26 10:00:00',
    },
  ]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Example function to post new payment data
    /*
    axios.post('/api/payments', formData)
      .then(response => {
        console.log('Payment added:', response.data);
        // setPayments([...payments, response.data]);
      })
      .catch(error => {
        console.error('Error adding payment:', error);
      });
    */
    handleClose();
  };

  // useEffect(() => {
  //   axios.get('/api/payments')
  //     .then(response => setPayments(response.data))
  //     .catch(error => console.error('Error fetching payments:', error));
  // }, []);

  return (
    <Box p={7}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ color: '#147c3c', mb: 2 }} mb={2}>
        <Typography variant="h5"  sx={{ color: '#147c3c', mb: 2,  alignContent:'center'}} >PAYMENTS MANAGEMENT</Typography>
        <Button variant="contained" color="success" onClick={handleOpen}>
          Add Payment
        </Button>
      </Box>

      <TableContainer sx={{ color: '#147c3c', mb: 2 }} component={Paper}>
        <Table sx={{ color: '#147c3c', mb: 2 }}>
          <TableHead sx={{ color: '#147c3c', mb: 2 }}>
            <TableRow sx={{ color: '#147c3c', mb: 2 }}>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.userName}</TableCell>
                <TableCell>{payment.providerName}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>{payment.paidAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      

      {/* Add Payment Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: '#147c3c', mb: 2 }}>Add New Payment</DialogTitle>
        <DialogContent sx={{ color: '#147c3c', mb: 2 }}>
          <TextField
            label="User ID"
            name="userId"
            fullWidth
            margin="dense"
            value={formData.userId}
            onChange={handleChange}
          />
          <TextField
            label="Provider ID"
            name="providerId"
            fullWidth
            margin="dense"
            value={formData.providerId}
            onChange={handleChange}
          />
          <TextField
            label="Booking ID"
            name="bookingId"
            fullWidth
            margin="dense"
            value={formData.bookingId}
            onChange={handleChange}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="dense"
            value={formData.amount}
            onChange={handleChange}
          />
          <TextField
            label="Payment Method"
            name="paymentMethod"
            select
            fullWidth
            margin="dense"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            
            <MenuItem value="mobile_money">Mobile Money</MenuItem>
            <MenuItem value="bank_transfer">Cash</MenuItem>
          </TextField>
          <TextField
            label="Status"
            name="status"
            select
            fullWidth
            margin="dense"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </TextField>
          <TextField
            label="Transaction ID"
            name="transactionId"
            fullWidth
            margin="dense"
            value={formData.transactionId}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="success" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;

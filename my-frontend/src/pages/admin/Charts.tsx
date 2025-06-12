import React from 'react';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as ReBarChart, Bar, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

const sampleData = [
  { name: 'Jan', bookings: 40, revenue: 2400 },
  { name: 'Feb', bookings: 30, revenue: 1398 },
  { name: 'Mar', bookings: 20, revenue: 9800 },
  { name: 'Apr', bookings: 27, revenue: 3908 },
  { name: 'May', bookings: 18, revenue: 4800 },
  { name: 'Jun', bookings: 23, revenue: 3800 },
];

const pieData = [
  { name: 'Card', value: 400 },
  { name: 'Cash', value: 300 },
  { name: 'Mobile', value: 300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export const LineChart = ({ title, dataKey }: { title: string; dataKey: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#147c3c', mb: 2 }} gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ReLineChart data={sampleData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} />
        </ReLineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const BarChart = ({ title, dataKey }: { title: string; dataKey: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#147c3c', mb: 2 }} gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart data={sampleData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#147c3c" />
        </ReBarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const PieChart = ({ title }: { title: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#147c3c', mb: 2 }} gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const DoughnutChart = ({ title }: { title: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h6"  sx={{ color: '#147c3c', mb: 2 }}gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <RePieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

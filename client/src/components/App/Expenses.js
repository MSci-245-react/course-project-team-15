import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@mui/material';

const Expenses = () => {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${serverURL}/api/getTotalExpenses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: getCurrentUserID(), 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const data = await response.json();
        setTotalSpent(data.totalExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">Total Expenses</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">${totalSpent}</Typography>
      </Grid>
    </Grid>
  );
};

export default Expenses;

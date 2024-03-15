import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const serverURL = "";

function Badges() {
  const [points, setPoints] = useState(0);

  const fetchUserPoints = async () => {
    try {
      const response = await fetch(`${serverURL}/api/getUserPoints`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user points. Status: ${response.status}`);
      }
      const data = await response.json();
      setPoints(data.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  useEffect(() => {
    fetchUserPoints(); 
  }, []);

  return (
    <div>
      <Typography variant="h3">Your Points: {points}</Typography>
    </div>
  );
}

export default Badges;

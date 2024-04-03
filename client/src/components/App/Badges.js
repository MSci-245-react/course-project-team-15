import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice'; // Import the LocalPolice icon from MUI
import { useLocation } from 'react-router-dom'; // Import useLocation hook

// Define a new mapping of badge levels to LocalPoliceIcon with different colors
const badgeIcons = {
  1: <LocalPoliceIcon style={{ fontSize: 100, color: "#e91e63" }} />, // Pink
  2: <LocalPoliceIcon style={{ fontSize: 100, color: "#9c27b0" }} />, // Purple
  3: <LocalPoliceIcon style={{ fontSize: 100, color: "#673ab7" }} />, // Deep Purple
  4: <LocalPoliceIcon style={{ fontSize: 100, color: "#3f51b5" }} />, // Indigo
  5: <LocalPoliceIcon style={{ fontSize: 100, color: "#2196f3" }} />, // Blue
  6: <LocalPoliceIcon style={{ fontSize: 100, color: "#03a9f4" }} />, // Light Blue
  7: <LocalPoliceIcon style={{ fontSize: 100, color: "#00bcd4" }} />, // Cyan
  8: <LocalPoliceIcon style={{ fontSize: 100, color: "#009688" }} />, // Teal
  9: <LocalPoliceIcon style={{ fontSize: 100, color: "#4caf50" }} />, // Green
  10: <LocalPoliceIcon style={{ fontSize: 100, color: "#ffeb3b" }} />, // Yellow
  11: <LocalPoliceIcon style={{ fontSize: 100, color: "#ff9800" }} />, // Orange
};

function Badges() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');

  const [reviewCount, setReviewCount] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (!userId) {
      console.error('UserID not provided in URL parameters');
      return;
    }

    fetch(`/api/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        setReviewCount(data.ReviewCount);
        determineBadges(data.ReviewCount);
      })
      .catch(error => console.error('Error fetching review count:', error));
  }, [userId]);

  const determineBadges = (count) => {
    const badgesEarned = [];
    for (let i = 1; i <= 11; i++) {
      if (count >= i * 10) {
        badgesEarned.push({ label: `Badge ${i}`, level: i });
      }
    }
    setBadges(badgesEarned);
  };

  return (
    <div>
      <Typography variant="h3" style={{ marginTop: '15px', marginBottom: '20px' }}>Your Badges</Typography>
      <Typography variant="h5" style={{ marginBottom: '5px' }}>
        Earn reward badges by reviewing and rating restaurants.
      </Typography>
      <Typography variant="h5" style={{ marginBottom: '40px' }}>
        A new badge will be earned for every 10 reviews.
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px' }}>
        {badges.map((badge, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {badgeIcons[badge.level]}
            <Typography variant="body1">{badge.label}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Badges;

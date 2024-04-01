import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Star'; // Import the badge icon from MUI
import { useLocation } from 'react-router-dom'; // Import useLocation hook

// Define a mapping of badge levels to badge icons
const badgeIcons = {
  1: <BadgeIcon color="primary" />,
  2: <BadgeIcon color="secondary" />,
  3: <BadgeIcon color="error" />,
  4: <BadgeIcon color="action" />,
  5: <BadgeIcon color="info" />,
  6: <BadgeIcon color="success" />,
  7: <BadgeIcon color="warning" />,
  8: <BadgeIcon color="primary" />,
  9: <BadgeIcon color="secondary" />,
  10: <BadgeIcon color="error" />,
  11: <BadgeIcon color="action" />,
};

function Badges() {
  const location = useLocation(); // Use useLocation hook to get current location
  const searchParams = new URLSearchParams(location.search); // Get URL search parameters
  const userId = searchParams.get('userId'); // Extract userId from URL parameters

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
  }, [userId]); // Fetch data whenever userId changes

  const determineBadges = (count) => {
    const badgesEarned = [];
    for (let i = 1; i <= 11; i++) {
      if (count >= i * 10) {
        badgesEarned.push({ label: `Badge ${i}: ${i * 10} reviews`, level: i });
      }
    }
    setBadges(badgesEarned);
  };

  return (
    <div>
      <Typography variant="h5">Your Badges</Typography>
      {badges.map((badge, index) => (
        <div key={index}>
          {badgeIcons[badge.level]} {/* Render the badge icon based on the badge level */}
          <Typography variant="body1">{badge.label}</Typography>
        </div>
      ))}
    </div>
  );
}

export default Badges;

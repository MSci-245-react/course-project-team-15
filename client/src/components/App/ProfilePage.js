import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Avatar, Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const userName = "User's Name";
  const userBio = "A brief bio about the user.";
  const friendsCount = 2;
  const expensesConut = 3;
  const badgesCount = 4;

  const [reviewsCount, setReviewsCount] = useState(0);
  const [visitedCount, setVisitedCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    const reviewsCount = JSON.parse(localStorage.getItem('restaurantReviews') || '[]');
    const beenToRestaurants = JSON.parse(localStorage.getItem('beenToRestaurants') || '[]');
    const shortlistedRestaurants = JSON.parse(localStorage.getItem('shortlistedRestaurants') || '[]');
    const favouriteRestaurants = JSON.parse(localStorage.getItem('favouriteRestaurants') || '[]');
    
    setReviewsCount(reviewsCount.length);
    setVisitedCount(beenToRestaurants.length);
    setShortlistedCount(shortlistedRestaurants.length);
    setFavouritesCount(favouriteRestaurants.length);
  }, []);

  return (
    <Container maxWidth="md">
      <Box paddingTop={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Avatar alt="User Name" src="/path/to/profile-pic.jpg" sx={{ width: 100, height: 100 }} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4">{userName}</Typography>
            <Typography variant="body1">{userBio}</Typography>
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography>Reviews: {reviewsCount}</Typography>
        <Typography>Visited: {visitedCount}</Typography>
        <Typography>Shortlisted: {shortlistedCount}</Typography>
        <Typography>Favourited: {favouritesCount}</Typography>
        <Typography>Friends: {friendsCount}</Typography>
        <Typography>Expenses: {expensesConut}</Typography>
        <Typography>Badges: {badgesCount}</Typography>
      </Paper>

      {/* All Lists */}
      <Button onClick={() => navigate('/ReviewsList')}>My Reviews</Button>
      <Button onClick={() => navigate('/BeenToList')}>Been</Button>
      <Button onClick={() => navigate('/Shortlist')}>Shortlist</Button>
      <Button onClick={() => navigate('/FavouritesList')}>Favourites</Button>
      <Button onClick={() => navigate('/friends')}>My Friends</Button>
      <Button onClick={() => navigate('/Expenses')}>My Expenses</Button>
      <Button onClick={() => navigate('/Badges')}>My Badges</Button>
    </Container>
  );
}

export default ProfilePage;
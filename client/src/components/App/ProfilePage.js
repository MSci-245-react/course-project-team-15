import React, { useState } from 'react';
import { Container, Typography, Button, Box, Grid, Avatar, Paper, List, ListItem, ListItemText} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const userName = "User's Name";
  const userBio = "A brief bio about the user.";
  const reviewsCount = 2;
  const friendsCount = 0;

  const navigate = useNavigate();

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
        <Typography># of Reviews: {reviewsCount}</Typography>
        <Typography># of Friends: {friendsCount}</Typography>
      </Paper>

      {/* All Lists */}
      <Button onClick={() => navigate('/ReviewsList')}>My Reviews</Button>
      <Button onClick={() => navigate('/BeenToList')}>Been</Button>
      <Button onClick={() => navigate('/WantToTryList')}>Want To Try</Button>
      <Button onClick={() => navigate('/FavouritesList')}>Favourites</Button>
    </Container>
  );
}

export default ProfilePage;
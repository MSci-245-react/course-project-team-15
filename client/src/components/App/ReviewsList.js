import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });

  React.useEffect(() => {
    const loadedReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
    setReviews(loadedReviews);
  }, []);

  const handleEditReview = (reviewId) => {
    const reviewToEdit = reviews.find(review => review.reviewId === reviewId);
    navigate('/review', { state: {reviewData: reviewToEdit, restaurantName: reviewToEdit.restaurantName} });
  };

  const handleDeleteReview = (reviewId) => {
    let updatedReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
    updatedReviews = updatedReviews.filter(review => review.reviewId !== reviewId);
    localStorage.setItem('restaurantReviews', JSON.stringify(updatedReviews));
    setReviews(updatedReviews);
  };

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="md">
      <Typography variant="h2" align="center" gutterBottom>My Reviews</Typography>
      <List>
        {reviews.map((review) => (
          <ListItem key={review.reviewId} alignItems="flex-start" divider>
            <ListItemText
              primary={review.restaurantName}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {review.reviewTitle} - {review.reviewContent} - {review.overallRating} stars
                  </Typography>
                  <Button onClick={() => handleEditReview(review.reviewId)}>Edit</Button>
                  <Button onClick={() => handleDeleteReview(review.reviewId)}>Delete</Button>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
    </ThemeProvider>
  );
}

export default ReviewsList;

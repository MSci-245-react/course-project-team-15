import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setReviews(loadedReviews);
  }, []);

  const handleEditReview = (index) => {
    const reviewToEdit = reviews[index];
    navigate('/review', { state: { reviewData: { ...reviewToEdit, index } } });
  };

  const handleDeleteReview = (index) => {
    let reviews = JSON.parse(localStorage.getItem('reviews'));
    reviews.splice(index, 1);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReviews(reviews);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>My Reviews</Typography>
      <List>
        {reviews.map((review, index) => (
          <ListItem key={index} alignItems="flex-start" divider>
            <ListItemText
              primary={review.restaurantName}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {review.address}
                  </Typography>
                  <Button onClick={() => handleEditReview(index)}>Edit</Button>
                  <Button onClick={() => handleDeleteReview(index)}>Delete</Button>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default ReviewsList;

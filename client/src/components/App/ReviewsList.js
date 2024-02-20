import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Rating } from '@mui/material';

function ReviewsList() {
  // Using these as example
  const reviews = [
    {
      restaurantName: 'Pasta Paradise',
      address: '123 Noodle Street, Carb City',
      review: 'Loved the spaghetti! Cozy atmosphere and friendly staff.',
      rating: 4,
    },
    {
      restaurantName: 'Sushi Summit',
      address: '789 Roll Ave, Fish Town',
      review: 'Fresh sushi, great variety. A bit pricey but worth it.',
      rating: 5,
    }
  ];

  const handleEditReview = (restaurantId) => {
    console.log(`Edit review ${restaurantId}`);
  };

  const handleDeleteReview = (restaurantId) => {
    console.log(`Delete review ${restaurantId}`);
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
                  — {review.review}
                  <Rating name="read-only" value={review.rating} readOnly />
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

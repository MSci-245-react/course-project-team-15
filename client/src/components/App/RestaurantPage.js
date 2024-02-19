import React, {useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Rating, Button} from '@mui/material';

function RestaurantPage() {
  const { id } = useParams();
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    cuisine: "",
    price: "",
    rating: 0,
    description: ""
  });
  
  useEffect(() => {
    // Will need to fetch the restaurant details from data source using the `id`
    const fetchedRestaurantDetails = {
      name: "Restaurant Name",
      cuisine: "Italian",
      price: "Medium",
      rating: 4.5,
      description: "Description for the restaurant."
    };
    setRestaurantDetails(fetchedRestaurantDetails);
  }, [id]); 

  const navigate = useNavigate();
  const navigateToReviewPage = () => {
    navigate('/review'); 
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1">{restaurantDetails.name}</Typography>
      <Typography variant="h6">Cuisine: {restaurantDetails.cuisine}</Typography>
      <Typography variant="h6">Price: {restaurantDetails.price}</Typography>
      <Typography variant="h6">Rating:</Typography>
      <Rating name="read-only" value={restaurantDetails.rating || 0} readOnly />
      <Typography paragraph>{restaurantDetails.description}</Typography>
      <Button onClick={navigateToReviewPage} variant="contained" color="primary">
        Write a Review
      </Button>
    </Container>
  );
}

export default RestaurantPage;

import React, {useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Rating, Button, Box} from '@mui/material';

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

  const [beenTo, setBeenTo] = useState(false);
  const [wantToTry, setWantToTry] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  const handleBeenToClick = () => {
    setBeenTo(!beenTo);
  };

  const handleWantToTryClick = () => {
    setWantToTry(!wantToTry);
  };

  const handleFavouriteClick = () => {
    setIsFavourite(!isFavourite);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1">{restaurantDetails.name}</Typography>
      <Typography variant="h6">Cuisine: {restaurantDetails.cuisine}</Typography>
      <Typography variant="h6">Price: {restaurantDetails.price}</Typography>
      <Typography variant="h6">Rating:</Typography>
      <Rating name="read-only" value={restaurantDetails.rating || 0} readOnly />
      <Typography paragraph>{restaurantDetails.description}</Typography>
      
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Button onClick={navigateToReviewPage} variant="outlined" color="primary">Write a Review</Button>
      <Button onClick={handleBeenToClick} variant="outlined" color={beenTo ? "secondary" : "primary"}>{beenTo ? "Visited" : "Been To"}</Button>
      <Button onClick={handleWantToTryClick} variant="outlined" color={wantToTry ? "secondary" : "primary"}>{wantToTry ? "Shortlisted" : "Want To Try"}</Button>
      <Button onClick={handleFavouriteClick} variant="outlined" color={isFavourite ? "secondary" : "primary"}>{isFavourite ? "Favourite" : "Add to Favourites"}</Button>
      </Box>

    </Container>
  );
}

export default RestaurantPage;

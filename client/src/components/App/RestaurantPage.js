import React, {useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Rating, Button, Box, Link} from '@mui/material';

function RestaurantPage() {
  const { id } = useParams();
  const [restaurantDetails, setRestaurantDetails] = useState({});
  
  React.useEffect(() => {
    const fetchRestaurantDetails = async () => {
      const url = `/api/restaurants/${id}`;
      console.log(url);
  
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch restaurant details: ${response.statusText}`);
        }
        const data = await response.json();
        setRestaurantDetails(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };
  
    fetchRestaurantDetails();
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
      <Typography variant="h4" component="h1" gutterBottom>{restaurantDetails.Name}</Typography>

      <Typography variant="h6">Description: {restaurantDetails.Description}</Typography>
      <Typography variant="h6">Categories: {restaurantDetails.Categories}</Typography>
      <Typography variant="h6">Price: {restaurantDetails.Price}</Typography>
      
      <Box display="flex" alignItems="center" my={2}>
        <Rating name="read-only" value={restaurantDetails.rating || 0} readOnly />
        <Typography variant="subtitle1" ml={1}>
          {restaurantDetails.rating || 'N/A'}
        </Typography>
      </Box>

      <Typography variant="h6">Website: 
      <Link href={restaurantDetails.Website} target="_blank" rel="noopener noreferrer">{restaurantDetails.Website}</Link>
      </Typography>

      <Typography variant="h6">Opening Hours: {restaurantDetails.OpeningHours}</Typography>
      
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
      <Button onClick={navigateToReviewPage} variant="outlined" color="primary">Write a Review</Button>
      <Button onClick={handleBeenToClick} variant="outlined" color={beenTo ? "secondary" : "primary"}>{beenTo ? "Visited" : "Been To"}</Button>
      <Button onClick={handleWantToTryClick} variant="outlined" color={wantToTry ? "secondary" : "primary"}>{wantToTry ? "Shortlisted" : "Shortlist"}</Button>
      <Button onClick={handleFavouriteClick} variant="outlined" color={isFavourite ? "secondary" : "primary"}>{isFavourite ? "Favourite" : "Add to Favourites"}</Button>
      </Box>

    </Container>
  );
}

export default RestaurantPage;

import React, {useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Rating, Button, Box, Link} from '@mui/material';

function RestaurantPage() {
  const { id } = useParams();
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [isReviewWritten, setIsReviewWritten] = useState(false); 
  
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

    // trying to save the review on page
    const existingReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
    const reviewWritten = existingReviews.some(review => review.restaurantID === id);
    setIsReviewWritten(reviewWritten);

  }, [id]);

  const navigate = useNavigate();
  const handleWriteReview = () => {
    const existingReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
    const reviewToEdit = existingReviews.find(review => review.restaurantID.toString() === id);

    navigate(`/review`, { state: { 
      restaurantID: restaurantDetails.id, 
      restaurantName: restaurantDetails.Name,
      reviewData: reviewToEdit } });
  };

  const [beenTo, setBeenTo] = useState(false);
  const [shortlist, setShortlist] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  React.useEffect(() => {
    const beenToRestaurants = JSON.parse(localStorage.getItem('beenToRestaurants') || '[]');
    setBeenTo(beenToRestaurants.includes(id));

    const shortlistedRestaurants = JSON.parse(localStorage.getItem('shortlistedRestaurants') || '[]');
    setShortlist(shortlistedRestaurants.includes(id));

    const favouriteRestaurants = JSON.parse(localStorage.getItem('favouriteRestaurants') || '[]');
    setIsFavourite(favouriteRestaurants.includes(id));
  }, [id]);


  const handleBeenToClick = () => {
    const beenToRestaurants = JSON.parse(localStorage.getItem('beenToRestaurants') || '[]');
    let updatedBeenToRestaurants;
  
    if (beenTo) {
      updatedBeenToRestaurants = beenToRestaurants.filter(r => r !== id);
    } else {
      updatedBeenToRestaurants = [...new Set([...beenToRestaurants, id])];
    }
    localStorage.setItem('beenToRestaurants', JSON.stringify(updatedBeenToRestaurants));
    setBeenTo(!beenTo);
  };

  const handleShortlistClick = () => {
    const shortlistedRestaurants = JSON.parse(localStorage.getItem('shortlistedRestaurants') || '[]');
    let updatedShortlistedRestaurants;
  
    if (shortlist) {
      updatedShortlistedRestaurants = shortlistedRestaurants.filter(r => r !== id);
    } else {
      updatedShortlistedRestaurants = [...new Set([...shortlistedRestaurants, id])];
    }
    localStorage.setItem('shortlistedRestaurants', JSON.stringify(updatedShortlistedRestaurants));
    setShortlist(!shortlist);
  };

  const handleFavouriteClick = () => {
    const favouriteRestaurants = JSON.parse(localStorage.getItem('favouriteRestaurants') || '[]');
    let updatedFavouriteRestaurants;
  
    if (isFavourite) {
      updatedFavouriteRestaurants = favouriteRestaurants.filter(r => r !== id);
    } else {
      updatedFavouriteRestaurants = [...new Set([...favouriteRestaurants, id])]; // Prevent duplicates
    }
    localStorage.setItem('favouriteRestaurants', JSON.stringify(updatedFavouriteRestaurants));
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
      <Button onClick={handleWriteReview} variant="outlined" color="primary"> {isReviewWritten ? "Edit Review" : "Write a Review"}</Button>
      <Button onClick={handleBeenToClick} variant="outlined" color={beenTo ? "secondary" : "primary"}>{beenTo ? "Visited" : "Been To"}</Button>
      <Button onClick={handleShortlistClick} variant="outlined" color={shortlist ? "secondary" : "primary"}>{shortlist ? "Shortlisted" : "Shortlist"}</Button>
      <Button onClick={handleFavouriteClick} variant="outlined" color={isFavourite ? "secondary" : "primary"}>{isFavourite ? "Favourite" : "Add to Favourites"}</Button>
      </Box>

    </Container>
  );
}

export default RestaurantPage;

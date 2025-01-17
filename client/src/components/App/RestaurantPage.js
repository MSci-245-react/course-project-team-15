import React, {useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Rating, Button, Box, Link, Grid} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function RestaurantPage() {
  const { id } = useParams();
  const [restaurantDetails, setRestaurantDetails] = useState({});
  const [isReviewWritten, setIsReviewWritten] = useState(false); 

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });
  
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

  React.useEffect(() => {
    const checkReviews = () => {
      const existingReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
      const reviewWritten = existingReviews.some(review => String(review.restaurantID) === String(id));
      setIsReviewWritten(reviewWritten);
    };

    checkReviews();
  }, [id]);

  const navigate = useNavigate();
  const handleWriteReview = () => {
    const existingReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
    const reviewToEdit = existingReviews.find(review => String(review.restaurantID) === String(id));

    navigate(`/review`, { state: { 
      restaurantID: id, 
      restaurantName: restaurantDetails.Name,
      reviewData: reviewToEdit
    }});
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
      updatedFavouriteRestaurants = [...new Set([...favouriteRestaurants, id])];
    }
    localStorage.setItem('favouriteRestaurants', JSON.stringify(updatedFavouriteRestaurants));
    setIsFavourite(!isFavourite);
  };

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="lg">
    <Box my={4}> 
      <Typography variant="h3" component="h1" gutterBottom>{restaurantDetails.Name}</Typography>
    </Box>
    <Box my={2}> 
      <Typography variant="h6">Description: {restaurantDetails.Description}</Typography>
    </Box>
    <Box my={2}> 
      <Typography variant="h6">Categories: {restaurantDetails.Categories}</Typography>
    </Box>
    <Box my={2}> 
      <Typography variant="h6">Price: {restaurantDetails.Price}</Typography>
    </Box>
      
      <Box display="flex" alignItems="center" my={2}>
        <Rating name="read-only" value={restaurantDetails.rating || 0} readOnly />
        <Typography variant="subtitle1" ml={1}>
          {restaurantDetails.rating || 'N/A'}
        </Typography>
      </Box>

      <Box my={2}> 
      <Typography variant="h6">Website: 
      <Link href={restaurantDetails.Website} target="_blank" rel="noopener noreferrer">{restaurantDetails.Website}</Link>
      </Typography>
      </Box>

      <Box my={2}> 
      <Typography variant="h6">Opening Hours: {restaurantDetails.OpeningHours}</Typography>
      </Box>

      <Grid item xs={14}>
      <Box display="flex" justifyContent="center" my={4}>
        <Button onClick={handleWriteReview} variant="outlined" color={isReviewWritten ? "secondary" : "primary"} sx={{ mx: 1 }}>{isReviewWritten ? "Edit Review" : "Write a Review"}</Button>
        <Button onClick={handleBeenToClick} variant="outlined" color={beenTo ? "secondary" : "primary"} sx={{ mx: 1 }}>{beenTo ? "Visited" : "Been To"}</Button>
        <Button onClick={handleShortlistClick} variant="outlined" color={shortlist ? "secondary" : "primary"} sx={{ mx: 1 }}>{shortlist ? "Shortlisted" : "Shortlist"}</Button>
        <Button onClick={handleFavouriteClick} variant="outlined" color={isFavourite ? "secondary" : "primary"} sx={{ mx: 1 }}>{isFavourite ? "Favourite" : "Add to Favourites"}</Button>
      </Box>
      </Grid>

    </Container>
    </ThemeProvider>
  );
}

export default RestaurantPage;

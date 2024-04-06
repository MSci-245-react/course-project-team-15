import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Rating, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function Recommendations() {
  const [cuisinePreference, setCuisinePreference] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const userId = 'w9adCiVAxfOLMsAftJn5PEJeOpl1';

  useEffect(() => {
    // Fetch the user's cuisine preference
    fetch(`/api/preferences/${userId}`)
      .then(response => response.json())
      .then(data => {
        setCuisinePreference(data.cuisinePreference);
        setRestaurants(data.restaurants);
        // Now fetch restaurants matching this preference
        return fetch(`/api/recommendations/${userId}`);
      })
      .then(response => response.json())
      .then(setRestaurants)
      .catch(console.error);
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>Your Recommendations</Typography>
      <Typography variant="h5">Cuisine Preference: {cuisinePreference}</Typography>
      <Grid container spacing={2}>
        {restaurants.map((restaurant) => (
          <Grid item key={restaurant.ID} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage}
                alt={restaurant.Name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">{restaurant.Name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.Description}
                </Typography>
                {/* Add more restaurant details here */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Recommendations;

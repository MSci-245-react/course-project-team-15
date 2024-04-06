import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Rating, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Recommendations() {
  const [cuisinePreference, setCuisinePreference] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [mealPreferences, setMealPreferences] = useState('');
  const [budget, setBudget] = useState('');
  const [cuisineRestaurants, setCuisineRestaurants] = useState([]);
  const [dietaryRestaurants, setDietaryRestaurants] = useState([]);
  const [mealRestaurants, setMealRestaurants] = useState([]);
  const [budgetRestaurants, setBudgetRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      fetch(`/api/cuisine-preference/${userId}`)
      .then(response => response.json())
      .then(data => {
        setCuisinePreference(data.cuisinePreference);
        setCuisineRestaurants(data.restaurants);
        return fetch(`/api/recommendations/${userId}`);
      })
      .then(response => response.json())
      .then(setRestaurants)
      .catch(console.error);

      // Fetching dietary restrictions and its restaurants
      fetch(`/api/dietary-restrictions/${userId}`)
        .then(response => response.json())
        .then(data => {
          setDietaryRestrictions(data.dietaryRestrictions);
          setDietaryRestaurants(data.restaurants);
        })
        .catch(console.error);

      // Fetching meal preferences and its restaurants
      fetch(`/api/meal-preference/${userId}`)
        .then(response => response.json())
        .then(data => {
          setMealPreferences(data.mealPreferences);
          setMealRestaurants(data.restaurants);
      })
      .catch(console.error);

      // Fetching budget and its restaurants
      fetch(`/api/budget/${userId}`)
        .then(response => response.json())
        .then(data => {
          setBudget(data.budget);
          setBudgetRestaurants(data.restaurants);
      })
      .catch(console.error);
    } else {
      navigate('/CreateAccount');
    }
  }, [navigate]);

  const handleCardClick = (id) => {
    navigate(`/restaurant/${id}`); 
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: true, dots: true }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };

  return (
    <Container maxWidth="lg">
    <Typography variant="h4" gutterBottom>Your Recommendations</Typography>
    {cuisinePreference && (
      <>
        <Typography variant="h5">Cuisine Preference: {cuisinePreference}</Typography>
        <Slider {...settings}>
          {cuisineRestaurants.map(restaurant => (
            <div key={restaurant.id}>
              <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage || '/placeholder.jpg'}
                alt={restaurant.Name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {restaurant.Name}
                </Typography>
                <Box display="flex" alignItems="center" my={2}>
                  <Rating name="read-only" value={restaurant.rating || 0} readOnly />
                  <Typography variant="subtitle1" ml={1}>
                    {restaurant.rating || 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.Description}
                </Typography>
              </CardContent>
            </Card>
            </div>
          ))}
        </Slider>
      </>
    )}
    {dietaryRestrictions && (
      <>
        <Typography variant="h5">Dietary Restrictions: {dietaryRestrictions}</Typography>
        <Slider {...settings}>
          {dietaryRestaurants.map(restaurant => (
            <div key={restaurant.id}>
              <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage || '/placeholder.jpg'}
                alt={restaurant.Name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {restaurant.Name}
                </Typography>
                <Box display="flex" alignItems="center" my={2}>
                  <Rating name="read-only" value={restaurant.rating || 0} readOnly />
                  <Typography variant="subtitle1" ml={1}>
                    {restaurant.rating || 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.Description}
                </Typography>
              </CardContent>
            </Card>
            </div>
          ))}
        </Slider>
      </>
    )}
    {mealPreferences && (
      <>
        <Typography variant="h5">Meal Preference: {mealPreferences}</Typography>
        <Slider {...settings}>
          {mealRestaurants.map(restaurant => (
            <div key={restaurant.id}>
              <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage || '/placeholder.jpg'}
                alt={restaurant.Name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {restaurant.Name}
                </Typography>
                <Box display="flex" alignItems="center" my={2}>
                  <Rating name="read-only" value={restaurant.rating || 0} readOnly />
                  <Typography variant="subtitle1" ml={1}>
                    {restaurant.rating || 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.Description}
                </Typography>
              </CardContent>
            </Card>
            </div>
          ))}
        </Slider>
      </>
    )}
    {budget && (
      <>
        <Typography variant="h5">Budget: {budget}</Typography>
        <Slider {...settings}>
          {budgetRestaurants.map(restaurant => (
            <div key={restaurant.id}>
              <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage || '/placeholder.jpg'}
                alt={restaurant.Name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {restaurant.Name}
                </Typography>
                <Box display="flex" alignItems="center" my={2}>
                  <Rating name="read-only" value={restaurant.rating || 0} readOnly />
                  <Typography variant="subtitle1" ml={1}>
                    {restaurant.rating || 'N/A'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {restaurant.Description}
                </Typography>
              </CardContent>
            </Card>
            </div>
          ))}
        </Slider>
      </>
    )}
  </Container>
  );
}

export default Recommendations;

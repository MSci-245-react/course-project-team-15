import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Rating, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });

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

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "orange" }}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "orange" }}
        onClick={onClick}
      />
    );
  }
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 2, infinite: true, dots: false }
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 }
      }
    ]
  };

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="lg">
    <Typography variant="h2" align="center" gutterBottom>Personalized Recommendations</Typography>
    {cuisinePreference && (
      <>
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>Cuisine Preference: {cuisinePreference}</Typography>
        <Slider {...settings}>
          {cuisineRestaurants.map(restaurant => (
            <div key={restaurant.id} style={{ padding: '10px' }}>
              <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage}
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
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>Dietary Restrictions: {dietaryRestrictions}</Typography>
        <Slider {...settings}>
          {dietaryRestaurants.map(restaurant => (
            <div key={restaurant.id} style={{ padding: '10px' }}>
              <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage}
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
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>Meal Preference: {mealPreferences}</Typography>
        <Slider {...settings}>
          {mealRestaurants.map(restaurant => (
            <div key={restaurant.id} style={{ padding: '10px' }}>
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
        <Typography variant="h5" style={{ fontWeight: 'bold' }}>Budget: {budget}</Typography>
        <Slider {...settings}>
          {budgetRestaurants.map(restaurant => (
            <div key={restaurant.id} style={{ padding: '10px' }}> 
              <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <CardMedia
                component="img"
                height="140"
                image={restaurant.FeaturedImage}
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
  </ThemeProvider>
  );
}

export default Recommendations;

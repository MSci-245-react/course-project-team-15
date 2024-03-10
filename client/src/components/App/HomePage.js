import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Rating,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

function HomePage() {
  const [cuisine, setCuisine] = useState([]);
  const [price, setPrice] = useState([]);
  const [dietary, setDietary] = useState([]);
  const [meals, setMeals] = useState([]);
  const [rating, setRating] = useState(1);

  const handleCuisineChange = (event) => {
    const { value, checked } = event.target;
    setCuisine((prevState) => {
      if (checked) {
        return [...prevState, value];
      } else {
        return prevState.filter((item) => item !== value);
      }
    });
  };

  const handlePriceChange = (event) => {
    const { value, checked } = event.target;
    setPrice((prevState) => {
      if (checked) {
        return [...prevState, value];
      } else {
        return prevState.filter((item) => item !== value);
      }
    });
  };

  const handleDietaryChange = (event) => {
    const { value, checked } = event.target;
    setDietary((prevState) => {
      if (checked) {
        return [...prevState, value];
      } else {
        return prevState.filter((item) => item !== value);
      }
    });
  };

  const handleMealsChange = (event) => {
    const { value, checked } = event.target;
    setMeals((prevState) => {
      if (checked) {
        return [...prevState, value];
      } else {
        return prevState.filter((item) => item !== value);
      }
    });
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  React.useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = () => {
    callApiLoadRestaurants()
      .then(res => {
        console.log("callApiLoadRestaurants returned: ", res);
        setRestaurants(res); 
      })
      .catch(err => console.error("Failed to load restaurants: ", err));
  }

  const callApiLoadRestaurants = async () => {
    const url = "/api/restaurants";
    console.log(url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (response.status !== 200) {
        const body = await response.text();
        throw Error(body.message || body);
    }
    return response.json();
};


  const handleCardClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const applyFilters = () => {
    // Apply filters based on selected checkboxes, rating, etc.
    // You can use the selected states (cuisine, price, dietary, meals, rating) here
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography variant="h3" component="h1" align="center">
            Welcome to TasteOfLoo
          </Typography>
          <Typography variant="h3" component="h2" align="center" style={{ fontSize: '24px' }}>
            Discover the best places to eat around the University of Waterloo.
          </Typography>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={6}>
              <Box mt={5} mb={2}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary" onClick={applyFilters}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Search and Filter Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Typography variant="h3" component="h3" style={{ fontSize: '24px' }}>Filters</Typography>
          <Grid container direction="column">
            <Grid item>
              <FormControl fullWidth>
                <Typography variant="body1" style={{ fontSize: '20px' }}>Cuisine Type</Typography>
                <label style={{ marginBottom: '5px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('american'), value: 'american'}})}>
                  <input
                    type="checkbox"
                    name="american"
                    checked={cuisine.includes('american')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="american">American</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('italian'), value: 'italian'}})}>
                  <input
                    type="checkbox"
                    name="italian"
                    checked={cuisine.includes('italian')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="italian">Italian</label>
                </label>
                <label style={{ marginBottom: '20px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('asian'), value: 'asian'}})}>
                  <input
                    type="checkbox"
                    name="asian"
                    checked={cuisine.includes('asian')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="asian">Asian</label>
                </label>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <Typography variant="body1" style={{ fontSize: '20px' }}>Price Range</Typography>
                <label style={{ marginBottom: '5px' }} onClick={() => handlePriceChange({target: {checked: !price.includes('low'), value: 'low'}})}>
                  <input
                    type="checkbox"
                    name="low"
                    checked={price.includes('low')}
                    onChange={handlePriceChange}
                  />
                  <label htmlFor="low">Low</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handlePriceChange({target: {checked: !price.includes('medium'), value: 'medium'}})}>
                  <input
                    type="checkbox"
                    name="medium"
                    checked={price.includes('medium')}
                    onChange={handlePriceChange}
                  />
                  <label htmlFor="medium">Medium</label>
                </label>
                <label style={{ marginBottom: '20px' }} onClick={() => handlePriceChange({target: {checked: !price.includes('high'), value: 'high'}})}>
                  <input
                    type="checkbox"
                    name="high"
                    checked={price.includes('high')}
                    onChange={handlePriceChange}
                  />
                  <label htmlFor="high">High</label>
                </label>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <Typography variant="body1" style={{ fontSize: '20px' }}>Dietary Options</Typography>
                <label style={{ marginBottom: '5px' }} onClick={() => handleDietaryChange({target: {checked: !dietary.includes('vegetarian'), value: 'vegetarian'}})}>
                  <input
                    type="checkbox"
                    name="vegetarian"
                    checked={dietary.includes('vegetarian')}
                    onChange={handleDietaryChange}
                  />
                  <label htmlFor="vegetarian">Vegetarian Friendly</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleDietaryChange({target: {checked: !dietary.includes('vegan'), value: 'vegan'}})}>
                  <input
                    type="checkbox"
                    name="vegan"
                    checked={dietary.includes('vegan')}
                    onChange={handleDietaryChange}
                  />
                  <label htmlFor="vegan">Vegan Options</label>
                </label>
                <label style={{ marginBottom: '20px' }} onClick={() => handleDietaryChange({target: {checked: !dietary.includes('gluten-free'), value: 'gluten-free'}})}>
                  <input
                    type="checkbox"
                    name="gluten-free"
                    checked={dietary.includes('gluten-free')}
                    onChange={handleDietaryChange}
                  />
                  <label htmlFor="gluten-free">Gluten-Free Options</label>
                </label>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <Typography variant="body1" style={{ fontSize: '20px' }}>Meal Times</Typography>
                <label style={{ marginBottom: '5px' }} onClick={() => handleMealsChange({target: {checked: !meals.includes('breakfast'), value: 'breakfast'}})}>
                  <input
                    type="checkbox"
                    name="breakfast"
                    checked={meals.includes('breakfast')}
                    onChange={handleMealsChange}
                  />
                  <label htmlFor="breakfast">Breakfast</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleMealsChange({target: {checked: !meals.includes('brunch'), value: 'brunch'}})}>
                  <input
                    type="checkbox"
                    name="brunch"
                    checked={meals.includes('brunch')}
                    onChange={handleMealsChange}
                  />
                  <label htmlFor="brunch">Brunch</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleMealsChange({target: {checked: !meals.includes('lunch'), value: 'lunch'}})}>
                  <input
                    type="checkbox"
                    name="lunch"
                    checked={meals.includes('lunch')}
                    onChange={handleMealsChange}
                  />
                  <label htmlFor="lunch">Lunch</label>
                </label>
                <label style={{ marginBottom: '20px' }} onClick={() => handleMealsChange({target: {checked: !meals.includes('dinner'), value: 'dinner'}})}>
                  <input
                    type="checkbox"
                    name="dinner"
                    checked={meals.includes('dinner')}
                    onChange={handleMealsChange}
                  />
                  <label htmlFor="dinner">Dinner</label>
                </label>
              </FormControl>
            </Grid>
            <Grid item>
              <Typography component="legend" style={{ fontSize: '20px' }}>Rating</Typography>
              <Rating name="simple-controlled" value={rating} onChange={handleRatingChange} />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={applyFilters}>
            Apply Filters
          </Button>
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                  <CardMedia 
                    component="img" 
                    height="140" 
                    image={restaurant.FeaturedImage}
                    alt={restaurant.name} 
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {restaurant.name}
                    </Typography>
                    <Rating value={restaurant.rating} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;


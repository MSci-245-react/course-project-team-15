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

  const [searchTerm, setSearchTerm] = useState('');

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

  const handleMapClick = () => {
    navigate('/Map');
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

  const callApiLoadRestaurants = async (idToken) => {
    const url = "/api/restaurants";
    console.log(url);

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: idToken,
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
          {/* Search Feature & Map Button */}
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={6}>
              <Box mt={4} mb={4}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  style={{ width: '540px' }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={handleMapClick} style={{ height: '56px', width: '150px' }}>
                View Map
              </Button>
             </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Filter Section */}
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
                <label style={{ marginBottom: '5px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('indian'), value: 'indian'}})}>
                  <input
                    type="checkbox"
                    name="indian"
                    checked={cuisine.includes('indian')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="indian">Indian</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('mexican'), value: 'mexican'}})}>
                  <input
                    type="checkbox"
                    name="mexican"
                    checked={cuisine.includes('mexican')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="mexican">Mexican</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('middle eastern'), value: 'middle eastern'}})}>
                  <input
                    type="checkbox"
                    name="middle eastern"
                    checked={cuisine.includes('middle eastern')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="middle eastern">Middle Eastern</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('african'), value: 'african'}})}>
                  <input
                    type="checkbox"
                    name="african"
                    checked={cuisine.includes('african')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="african">African</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleCuisineChange({target: {checked: !cuisine.includes('greek'), value: 'greek'}})}>
                  <input
                    type="checkbox"
                    name="greek"
                    checked={cuisine.includes('greek')}
                    onChange={handleCuisineChange}
                  />
                  <label htmlFor="greek">Greek</label>
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
                <label style={{ marginBottom: '5px' }} onClick={() => handlePriceChange({target: {checked: !price.includes('$'), value: '$'}})}>
                  <input
                    type="checkbox"
                    name="$"
                    checked={price.includes('$')}
                    onChange={handlePriceChange}
                  />
                  <label htmlFor="$">$</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handlePriceChange({target: {checked: !price.includes('$$'), value: '$$'}})}>
                  <input
                    type="checkbox"
                    name="$$"
                    checked={price.includes('$$')}
                    onChange={handlePriceChange}
                  />
                  <label htmlFor="$$">$$</label>
                </label>
                <label style={{ marginBottom: '20px' }} onClick={() => handlePriceChange({target: {checked: !price.includes('$$$'), value: '$$$'}})}>
                  <input
                    type="checkbox"
                    name="$$$"
                    checked={price.includes('$$$')}
                    onChange={handlePriceChange}
                  />
                  <label htmlFor="$$$">$$$</label>
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
                  <label htmlFor="vegetarian">Vegetarian</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleDietaryChange({target: {checked: !dietary.includes('vegan'), value: 'vegan'}})}>
                  <input
                    type="checkbox"
                    name="vegan"
                    checked={dietary.includes('vegan')}
                    onChange={handleDietaryChange}
                  />
                  <label htmlFor="vegan">Vegan</label>
                </label>
                <label style={{ marginBottom: '5px' }} onClick={() => handleDietaryChange({target: {checked: !dietary.includes('halal'), value: 'halal'}})}>
                  <input
                    type="checkbox"
                    name="halal"
                    checked={dietary.includes('halal')}
                    onChange={handleDietaryChange}
                  />
                  <label htmlFor="halal">Halal</label>
                </label>
                <label style={{ marginBottom: '20px' }} onClick={() => handleDietaryChange({target: {checked: !dietary.includes('gluten-free'), value: 'gluten-free'}})}>
                  <input
                    type="checkbox"
                    name="gluten-free"
                    checked={dietary.includes('gluten-free')}
                    onChange={handleDietaryChange}
                  />
                  <label htmlFor="gluten-free">Gluten-free</label>
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
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
          {restaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          restaurant.rating >= rating && 
          (price.length === 0 || price.includes(restaurant.Price)) && 
          (cuisine.length === 0 || cuisine.some(selectedCuisine =>
            restaurant.Categories.toLowerCase().split(',').some(cat => 
              new RegExp("\\b" + selectedCuisine.toLowerCase() + "\\b", "i").test(cat.trim())
          ))) &&
          (meals.length === 0 || meals.some(selectedMeal => 
            restaurant.Categories.toLowerCase().split(',').some(meal => 
              new RegExp("\\b" + selectedMeal.toLowerCase() + "\\b", "i").test(meal.trim())
          ))) &&
          (dietary.length === 0 || dietary.some(selectedDiet =>
            restaurant.Categories.toLowerCase().split(',').some(diet =>
              new RegExp("\\b" + selectedDiet.toLowerCase() + "\\b", "i").test(diet.trim())
          ))))
          .map((restaurant) => (
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

                    <Box display="flex" alignItems="center" my={2}>
                      <Rating name="read-only" value={restaurant.rating || 0} readOnly />
                      <Typography variant="subtitle1" ml={1}>
                        {restaurant.rating || 'N/A'}
                      </Typography>
                      <Typography variant="subtitle1" ml={2}><span>{restaurant.Price}</span>
                      </Typography>
                    </Box>
                    
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


import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, TextField, 
    InputAdornment, InputLabel, Select, MenuItem, FormControl, Rating} from '@mui/material';

function HomePage() {
    const [cuisine, setCuisine] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [dietary, setDietary] = React.useState('');
    const [rating, setRating] = React.useState(2);

    const handleCuisineChange = (event) => {
        setCuisine(event.target.value);
    };
    const handlePriceChange = (event) => {
        setPrice(event.target.value);
    };
    const handleDietaryChange = (event) => {
        setDietary(event.target.value);
    };
    const handleRatingChange = (event, newValue) => {
        setRating(newValue);
    };

    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([
        {
            id: '1',
            name: 'Pasta Paradise',
            description: 'A delightful journey through the flavors of Italy.',
            imageUrl: '/static/images/cards/italian.png',
            rating: 4.5,
        }
    ]);

    const handleCardClick = (id) => {
        navigate(`/restaurant/${id}`);
    };

    return (
    <Container maxWidth="lg">
        <Typography variant="h3" component="h1">
            Welcome to TasteOfLoo
        </Typography>
        <Typography variant="h6" component="h2">
            Discover the best places to eat around the University of Waterloo.
        </Typography>

        {/* Search and Filter Section */}
        <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
            <Grid item xs={12}>
                <TextField fullWidth label="Search Restaurants" variant="outlined" />
            </Grid>
            <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel id="cuisine-label">Cuisine</InputLabel>
                        <Select
                            labelId="cuisine-label"
                            id="cuisine-select"
                            value={cuisine}
                            label="Cuisine"
                            onChange={handleCuisineChange}
                        >
                            <MenuItem value="Italian">Italian</MenuItem>
                            <MenuItem value="Chinese">Chinese</MenuItem>
                            <MenuItem value="Indian">Indian</MenuItem>
                        </Select>
                    </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel id="price-label">Price</InputLabel>
                        <Select
                            labelId="price-label"
                            id="price-select"
                            value={price}
                            label="Price"
                            onChange={handlePriceChange}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel id="dietary-label">Dietary Restrictions</InputLabel>
                        <Select
                            labelId="dietary-label"
                            id="dietary-select"
                            value={dietary}
                            label="Dietary Restrictions"
                            onChange={handleDietaryChange}
                        >
                            <MenuItem value="Vegan">Vegan</MenuItem>
                            <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                            <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
                        </Select>
                    </FormControl>
            </Grid> 
            <Grid item xs={12} sm={3}>
                <Typography component="legend">Rating</Typography>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={handleRatingChange}
                />
            </Grid>
            </Grid>

            {/* Restaurant Listings*/}
            <Grid container spacing={3}>
                {restaurants.map((restaurant) => (
                <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                    <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={restaurant.imageUrl}
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
    </Container>
  );
}

export default HomePage;
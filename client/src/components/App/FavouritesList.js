import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function FavouritesList() {
  const navigate = useNavigate();
  const [favouriteRestaurants, setFavouriteRestaurants] = useState([]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });

  React.useEffect(() => {
    fetchFavouriteRestaurants();
  }, []);

  const fetchFavouriteRestaurants = async () => {
    const favouriteRestaurantIds = JSON.parse(localStorage.getItem('favouriteRestaurants') || '[]');
    const fetchedRestaurants = [];
    
    for (const id of favouriteRestaurantIds) {
      try {
        const response = await fetch(`/api/restaurants/${id}`);
        if (response.ok) {
          const data = await response.json();
          fetchedRestaurants.push({ id, name: data.Name, address: data.FullAddress });
        }
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    }
    
    setFavouriteRestaurants(fetchedRestaurants);
  };

  const handleDelete = (restaurantId) => {
    const updatedFavouriteRestaurants = JSON.parse(localStorage.getItem('favouriteRestaurants') || '[]').filter(id => id !== restaurantId);
    localStorage.setItem('favouriteRestaurants', JSON.stringify(updatedFavouriteRestaurants));
    setFavouriteRestaurants(favouriteRestaurants.filter(restaurant => restaurant.id !== restaurantId));
  };

  const handleView = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="md">
      <Typography variant="h2" align="center" gutterBottom>My Favourite Restaurants</Typography>
      <List>
        {favouriteRestaurants.map((restaurant) => (
          <ListItem key={restaurant.id} divider>
            <ListItemText primary={restaurant.name}/>
            <Button onClick={() => handleView(restaurant.id)} style={{ marginRight: '8px' }}>View</Button>
            <Button onClick={() => handleDelete(restaurant.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Container>
    </ThemeProvider>
  );
}

export default FavouritesList;
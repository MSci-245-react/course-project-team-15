import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Shortlist() {
  const navigate = useNavigate();
  const [shortlistedRestaurants, setShortlistedRestaurants] = useState([]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });
  
  React.useEffect(() => {
    fetchShortlistedRestaurants();
  }, []);

  const fetchShortlistedRestaurants = async () => {
    const shortlistedRestaurantIds = JSON.parse(localStorage.getItem('shortlistedRestaurants') || '[]');
    const fetchedRestaurants = [];
    
    for (const id of shortlistedRestaurantIds) {
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
    
    setShortlistedRestaurants(fetchedRestaurants);
  };

  const handleDelete = (restaurantId) => {
    const updatedShortlistedRestaurants = JSON.parse(localStorage.getItem('shortlistedRestaurants') || '[]').filter(id => id !== restaurantId);
    localStorage.setItem('shortlistedRestaurants', JSON.stringify(updatedShortlistedRestaurants));
    setShortlistedRestaurants(shortlistedRestaurants.filter(restaurant => restaurant.id !== restaurantId));
  };

  const handleView = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  return (
    <ThemeProvider theme={theme}>
    <Container maxWidth="md">
      <Typography variant="h2" align="center" gutterBottom>Places I Wish To Go</Typography>
      <List>
        {shortlistedRestaurants.map((restaurant) => (
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

export default Shortlist;
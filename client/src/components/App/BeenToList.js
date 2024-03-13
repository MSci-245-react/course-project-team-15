import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

function BeenToList() {
  const navigate = useNavigate();
  const [beenToRestaurants, setBeenToRestaurants] = useState([]);

  React.useEffect(() => {
    fetchBeenToRestaurants();
  }, []);

  const fetchBeenToRestaurants = async () => {
    const beenToRestaurantIds = JSON.parse(localStorage.getItem('beenToRestaurants') || '[]');
    const fetchedRestaurants = [];
    
    for (const id of beenToRestaurantIds) {
      try {
        const response = await fetch(`/api/restaurants/${id}`);
        const data = await response.json();
        fetchedRestaurants.push({ id, name: data.Name, address: data.FullAddress });
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    }
    
    setBeenToRestaurants(fetchedRestaurants);
  };

  const handleDelete = (restaurantId) => {
    const updatedBeenToRestaurantIds = JSON.parse(localStorage.getItem('beenToRestaurants') || '[]').filter(id => id !== restaurantId);
    localStorage.setItem('beenToRestaurants', JSON.stringify(updatedBeenToRestaurantIds));
    setBeenToRestaurants(beenToRestaurants.filter(restaurant => restaurant.id !== restaurantId));
  };

  const handleView = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };
  
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Been To</Typography>
      <List>
        {beenToRestaurants.map((restaurant) => (
          <ListItem key={restaurant.id} divider>
            <ListItemText primary={restaurant.name} />
            <Button onClick={() => handleView(restaurant.id)} style={{ marginRight: '8px' }}>View</Button>
            <Button onClick={() => handleDelete(restaurant.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default BeenToList;

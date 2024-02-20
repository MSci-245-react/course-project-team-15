import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

function FavouritesList() {
  const navigate = useNavigate();
  const [beenToRestaurants, setBeenToRestaurants] = useState([
    {
      id: '1',
      name: 'Pasta Paradise',
      address: '123 Noodle Street, Carb City',
    },
    {
      id: '2',
      name: 'Sushi Summit',
      address: '789 Roll Ave, Fish Town',
    },
  ]);

  const handleDelete = (restaurantId) => {
    console.log(`Delete review ${restaurantId}`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>My Favourites</Typography>
      <List>
        {beenToRestaurants.map((restaurant) => (
          <ListItem key={restaurant.id} divider>
            <ListItemText primary={restaurant.name} secondary={restaurant.address} />
            <Button onClick={() => handleDelete(restaurant.id)}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default FavouritesList;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

function WantToTryList() {
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

  const handleDelate = (restaurantId) => {
    console.log(`Delate review ${restaurantId}`);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Want To Try</Typography>
      <List>
        {beenToRestaurants.map((restaurant) => (
          <ListItem key={restaurant.id} divider>
            <ListItemText primary={restaurant.name} secondary={restaurant.address} />
            <Button onClick={() => handleDelate(restaurant.id)}>Delate</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default WantToTryList;
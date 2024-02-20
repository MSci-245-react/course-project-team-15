import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button} from '@mui/material';

function Friends() {
  const friendsList = [
    { id: 1, name: 'John Doe', profilePic: '/path/to/johndoe.jpg'},
    { id: 2, name: 'Jane Smith', profilePic: '/path/to/janesmith.jpg'},
  ];

  const handleUnfollow = (friendId) => {
    console.log("Unfollow", friendId);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>My Friends</Typography>
      <List>
        {friendsList.map((friend) => (
          <ListItem key={friend.id} secondaryAction={
            <Button onClick={() => handleUnfollow(friend.id)} color="primary">Unfollow</Button>
          }>
            <ListItemAvatar>
              <Avatar src={friend.profilePic} alt={friend.name} />
            </ListItemAvatar>
            <ListItemText primary={friend.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Friends;
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Button } from '@mui/material';

const serverURL = "";

const Follow = () => {
  const [users, setUsers] = useState([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${serverURL}/api/getUsers`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (userID) => {
    try {
      const response = await fetch(`${serverURL}/api/followUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: 1,
          followUserID: userID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.userID !== userID));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">Follow Users</Typography>
      </Grid>
      <Grid item xs={12}>
        {users.map((user) => (
          <div key={user.userID}>
            <Typography variant="subtitle1">{user.username}</Typography>
            <Button variant="contained" onClick={() => handleFollow(user.userID)}>
              Follow
            </Button>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default Follow;

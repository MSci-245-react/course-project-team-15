import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { unfollowUser } from './api'; 

const serverURL = "";

function Friends() {
  const [followedUsers, setFollowedUsers] = useState([]);

  React.useEffect(() => {
    fetchFollowedUsers();
  }, []);

  const fetchFollowedUsers = async () => {
    const response = await fetch('/api/followedUsers');
    const data = await response.json();
    setFollowedUsers(data);
  };

  const handleUnfollow = async (userId) => {
    const response = await unfollowUser(userId);
    if (response.success) {
      setFollowedUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } else {
      console.error('Failed to unfollow user');
    }
  };

  return (
    <div>
      <h2>Friends</h2>
      <ul>
        {followedUsers.map(user => (
          <li key={user.id}>
            {user.name}
            <Button onClick={() => handleUnfollow(user.id)}>Unfollow</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;

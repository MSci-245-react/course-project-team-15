import React, { useState, useContext, useEffect } from 'react';


import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import Grid from "@mui/material/Grid";
import callApiLoadUserSettings from './callApiLoadUserSettings.js';
import Button from '@mui/material/Button';

import { FirebaseContext } from '../Firebase';
const serverURL = '';


const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});


const Home = () => {
  const [userID, setuserID] = useState(null); // State to hold the user ID
  const [movies, setMovies] = useState([]);
  const firebase = useContext(FirebaseContext);
  const [idToken, setIdToken] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = firebase.auth.currentUser; // Access the current user
        if (user) {
          // Get the ID token and UID if the user is signed in
          const token = await user.getIdToken();
          setIdToken(token);
          setuserID(user.uid); // Set the user ID in state
        }
      } catch (error) {
        console.error('Error fetching user details:',
          error);
      }
    };
    fetchUserDetails();
  }, [firebase]);

  useEffect(() => {
    if (idToken) {
      getMovies();
    }
  }, [idToken]);

  const getMovies = () => {
    if (!userID) {
      console.error('No user ID available');
      return;
    }
    callApiLoadUserSettings(serverURL, userID, idToken)
      .then(movies => {
        setMovies(movies);
        console.log('Movies received: ', movies);
      })
      .catch(error => {
        console.error('Error loading movies:',
          error.message);
      });
  };
  const handleSignOut = () => {
    firebase
      .doSignOut()
      .then(() => console.log('Signed out successfully'))
      .catch(error => console.error('Sign out error:',
        error));
  };

  return (
    <>
      <Grid container>
        <Grid item>
          <Typography>Welcome to MSci342!</Typography>
          <Typography>You are on the Home page.</Typography>
          <Typography>You have been authenticated with Firebase</Typography>
        </Grid>
        <Grid item>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </Grid>
      </Grid>
    </>
  );
};


export default Home;
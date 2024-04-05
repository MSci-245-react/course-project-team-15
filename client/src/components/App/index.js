import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import axios from 'axios';

import HomePage from './HomePage';
import FeedPage from './FeedPage';
import Recommendations from './Recommendations';
import ProfilePage from './ProfilePage';
import Review from './Review';
import RestaurantPage from './RestaurantPage';
import ReviewsList from './ReviewsList';
import BeenToList from './BeenToList';
import Shortlist from './Shortlist';
import FavouritesList from './FavouritesList';
import Friends from './Friends';
import Survey from './Survey';
import Map from './Map';
import Expenses from './Expenses';
import Badges from './Badges';
import Follow from './Follow';

import CreateAccount from './CreateAccount';

import { unfollowUser } from './api';

import React, { useState, useEffect, useContext } from 'react';
import PrivateRoute from '../Navigation/PrivateRoute';
import { FirebaseContext } from '../Firebase';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  //...
  });

function App() {
  const [surveyCompleted, setSurveyCompleted] = useState(false);

  const handleSurveyComplete = () => {
    setSurveyCompleted(true);
  };

  const handleUnfollowUser = async (userId) => {
    try {
      const data = await unfollowUser(userId);
      console.log(data);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const response = await axios.post(`/api/likeReview/${reviewId}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext); // Use Firebase context
  useEffect(() => {
    if (firebase) {
      // Check if firebase is not null
      const listener = firebase.auth.onAuthStateChanged(user => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      });
      // Cleanup function
      return () => listener();
    }
  }, [firebase]);
  // Determine authentication status based on authUser's presence
  const authenticated = !!authUser;

    // Function to handle sign out
    const handleSignOut = () => {
      firebase.auth.signOut().then(() => {
        console.log('Signed out successfully');
        // Optionally, redirect the user or perform other actions post sign-out
      }).catch((error) => {
        console.error('Sign out error:', error);
      });
    };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <PrivateRoute authenticated={authenticated} authUser={authUser} />
        </div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link component={Link} to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>TasteOfLoo</Link>
            </Typography>
            <Button color="inherit" component={Link} to="/FeedPage">Feed</Button>
            <Button color="inherit" component={Link} to="/Recommendations">Recommendations</Button>
            <Button color="inherit" component={Link} to="/ProfilePage">Profile</Button>
            <Button color="inherit" component={Link} to="/CreateAccount">Create Account</Button>
            {authUser && (
              <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
            )}
          </Toolbar>
        </AppBar>

        <Container>
          <Routes>
            <Route path="/survey" element={<Survey onSurveyComplete={handleSurveyComplete} />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/FeedPage" element={<FeedPage onLikeReview={handleLikeReview} />} />
            <Route path="/Recommendations" element={<Recommendations />} />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/restaurant/:id" element={<RestaurantPage />} />
            <Route path="/review" element={<Review />} />
            <Route path="/ReviewsList" element={<ReviewsList />} />
            <Route path="/BeenToList" element={<BeenToList />} />
            <Route path="/Shortlist" element={<Shortlist />} />
            <Route path="/FavouritesList" element={<FavouritesList />} />
            <Route path="/Friends" element={<Friends onUnfollowUser={handleUnfollowUser} />} />
            <Route path="/Map" element={<Map />} />
            <Route path="/Expenses" element={<Expenses />} />
            <Route path="/Badges" element={<Badges />} />
            <Route path="/Follow" element={<Follow />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;

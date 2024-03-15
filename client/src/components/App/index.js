import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

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

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>TasteOfLoo</Link>
          </Typography>
          <Button color="inherit" component={Link} to="/FeedPage">Feed</Button>
          <Button color="inherit" component={Link} to="/Recommendations">Recommendations</Button>
          <Button color="inherit" component={Link} to="/ProfilePage">Profile</Button>
          <Button color="inherit" component={Link} to="/CreateAccount">Create Account</Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/survey" element={<Survey onSurveyComplete={handleSurveyComplete} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/FeedPage" element={<FeedPage />} />
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
  );
}

export default App;

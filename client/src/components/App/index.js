import React from 'react';
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
import WantToTryList from './WantToTryList';
import FavouritesList from './FavouritesList';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link component={Link} to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold'}}>TasteOfLoo</Link>
        </Typography>
          <Button color="inherit" component={Link} to="/FeedPage">Feed</Button>
          <Button color="inherit" component={Link} to="/Recommendations">Recommendations</Button>
          <Button color="inherit" component={Link} to="/ProfilePage">Profile</Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/FeedPage" element={<FeedPage />} />
          <Route path="/Recommendations" element={<Recommendations />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/review" element={<Review />} />
          <Route path="/ReviewsList" element={<ReviewsList />} />
          <Route path="/BeenToList" element={<BeenToList />} />
          <Route path="/WantToTryList" element={<WantToTryList />} />
          <Route path="/FavouritesList" element={<FavouritesList />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Avatar, Paper, TextField} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import profilePicDefault from './../../assets/images/default-profile-pic.png';

function ProfilePage() {
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [displayBio, setDisplayBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false); 
  const [profilePic, setProfilePic] = useState(profilePicDefault);
  
  const [surveyResults, setSurveyResults] = useState({
    cuisinePreference: '',
    dietaryRestrictions: '',
    mealPreference: '',
    budget: '',
    ambiancePreference: '',
    diningFrequency: '',
    healthImportance: '',
    allergies: '',
  });
  
  const badgesCount = 4;

  const [reviewsCount, setReviewsCount] = useState(0);
  const [visitedCount, setVisitedCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [favouritesCount, setFavouritesCount] = useState(0);

  const navigate = useNavigate();

  React.useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      console.log("Fetching details for UID:", user.uid);
      const uid = user.uid;
      const url = `/api/user-info/${uid}`;
      console.log(url);

      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log("Received data:", data);
          if (data.error) {
            throw new Error(data.error);
          }
            const firstName = data.user.firstName || "John";
            const lastName = data.user.lastName || "Snow";

            setUserName(`${firstName} ${lastName}`);
        })
        .catch(error => console.error("There was an error fetching the user details:", error));

        const surveyResultsUrl = `/api/survey-results/${uid}`;
        fetch(surveyResultsUrl)
        .then(response => response.json())
        .then(data => {
          console.log("Received data:", data);
          if (data.error) {
            throw new Error(data.error);
          }
            setSurveyResults(data);
        })
        .catch(error => console.error("There was an error fetching the user details:", error));
    } else {
      console.log("No user logged in");
    }
    const reviewsCount = JSON.parse(localStorage.getItem('restaurantReviews') || '[]');
    const beenToRestaurants = JSON.parse(localStorage.getItem('beenToRestaurants') || '[]');
    const shortlistedRestaurants = JSON.parse(localStorage.getItem('shortlistedRestaurants') || '[]');
    const favouriteRestaurants = JSON.parse(localStorage.getItem('favouriteRestaurants') || '[]');
    
    setReviewsCount(reviewsCount.length);
    setVisitedCount(beenToRestaurants.length);
    setShortlistedCount(shortlistedRestaurants.length);
    setFavouritesCount(favouriteRestaurants.length);
  }, []);

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleBioSubmit = () => {
    setDisplayBio(bio);
    setIsEditingBio(false);
  };

  const handleEditClick = () => {
    setIsEditingBio(true);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const imageURL = URL.createObjectURL(event.target.files[0]);
      setProfilePic(imageURL);
    }
  };

  const handleEditSurveyClick = () => {
    navigate('/Survey');
  };

  const surveyEntries = Object.entries(surveyResults);


  return (
    <Container maxWidth="md">
      <Box paddingTop={2}>
        <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
            <Avatar alt={userName} src={profilePic} sx={{ width: 100, height: 100 }} />
            <input
              accept="image/*"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="raised-button-file"
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span" style={{ marginTop: '10px' }}>
                Edit Image
              </Button>
            </label>
          </Grid>
          <Grid item xs={4} sm={8}>
            <Typography variant="h4">{userName}</Typography>
            <Typography variant="body1">{displayBio || "No bio available."}</Typography>
            {isEditingBio ? (
              <Box my={2}>
                <TextField
                  label="Edit Bio"
                  variant="outlined"
                  fullWidth
                  value={bio}
                  onChange={handleBioChange}
                  multiline
                  rows={4}
                />
                <Button onClick={handleBioSubmit} color="primary" variant="contained" style={{marginTop: '10px'}}>
                  Submit Bio
                </Button>
              </Box>
            ) : (
              <Button onClick={handleEditClick} color="primary" variant="outlined" style={{marginTop: '10px'}}>
                Edit Bio
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography>Reviews: {reviewsCount}</Typography>
        <Typography>Visited: {visitedCount}</Typography>
        <Typography>Shortlisted: {shortlistedCount}</Typography>
        <Typography>Favourited: {favouritesCount}</Typography>
        {/* <Typography>Friends: {friendsCount}</Typography> */}
        {/* <Typography>Expenses: {expensesConut}</Typography> */}
        <Typography>Badges: {badgesCount}</Typography>
        {/* <Typography>Follow People: {followCount}</Typography> */}
      </Paper>

      {/* All Lists */}
      <Button onClick={() => navigate('/ReviewsList')}>My Reviews</Button>
      <Button onClick={() => navigate('/BeenToList')}>Been</Button>
      <Button onClick={() => navigate('/Shortlist')}>Shortlist</Button>
      <Button onClick={() => navigate('/FavouritesList')}>Favourites</Button>
      {/* <Button onClick={() => navigate('/friends')}>My Friends</Button> */}
      {/* <Button onClick={() => navigate('/Expenses')}>My Expenses</Button> */}
      <Button onClick={() => navigate('/Badges?userId=1')}>My Badges</Button>
      {/* <Button onClick={() => navigate('/Follow')}>Follow People</Button> */}

      <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6">Survey Results:</Typography>
        <p>Cuisine Preference: {surveyResults.cuisinePreference}</p>
        <p>Dietary Restrictions: {surveyResults.dietaryRestrictions}</p>
        <p>Meal Preference: {surveyResults.mealPreference}</p>
        <p>Budget: {surveyResults.budget}</p>
        <p>Ambiance Preference: {surveyResults.ambiancePreference}</p>
        <p>Dining Frequency: {surveyResults.diningFrequency}</p>
        <p>Health Importance: {surveyResults.healthImportance}</p>
        <p>Allergies: {surveyResults.allergies}</p>
      </Paper>
      <Button variant="outlined" onClick={handleEditSurveyClick} style={{ marginTop: '10px' }}>
          Edit Survey
      </Button>

    </Container>
    
  );
}

export default ProfilePage;
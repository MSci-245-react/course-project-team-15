import React, { useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import MovieSelection from './MovieSelection';
import ReviewTitle from './ReviewTitle';
import ReviewBody from './ReviewBody';
import ReviewRating from './ReviewRating';

const serverURL = "";

function Review() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredReview, setEnteredReview] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});
  
  // State variables for different ratings
  const [customerServiceRating, setCustomerServiceRating] = useState('');
  const [atmosphereRating, setAtmosphereRating] = useState('');
  const [priceRating, setPriceRating] = useState('');

  React.useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = () => {
    callApiLoadMovies()
      .then(res => {
        console.log("callApiLoadMovies returned: ", res)
        var parsed = JSON.parse(res.express);
        console.log("callApiLoadMovies parsed: ", parsed);
        setMovies(parsed);
      })
  }

  const callApiLoadMovies = async () => {
    const url = serverURL + "/api/getMovies";
    console.log(url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log("User settings: ", body);
    return body;
  }

  const handleMovieChange = (movie) => {
    setSelectedMovie(movie);
    setErrors((prevErrors) => ({ ...prevErrors, selectedMovie: false }));
    setShowConfirmation(false);
  };

  const handleTitleChange = (event) => {
    setEnteredTitle(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, enteredTitle: false }));
    setShowConfirmation(false);
  };

  const handleReviewChange = (event) => {
    setEnteredReview(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, enteredReview: false }));
    setShowConfirmation(false);
  };

  // Event handlers for rating changes
  const handleCustomerServiceRatingChange = (event) => {
    setCustomerServiceRating(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, customerServiceRating: false }));
    setShowConfirmation(false);
  };

  const handleAtmosphereRatingChange = (event) => {
    setAtmosphereRating(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, atmosphereRating: false }));
    setShowConfirmation(false);
  };

  const handlePriceRatingChange = (event) => {
    setPriceRating(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, priceRating: false }));
    setShowConfirmation(false);
  };

  const handleSubmit = () => {
    let hasErrors = false;
    const newErrors = {};

    if (!selectedMovie) {
      newErrors.selectedMovie = true;
      hasErrors = true;
    }
    if (!enteredTitle) {
      newErrors.enteredTitle = true;
      hasErrors = true;
    }
    if (!enteredReview) {
      newErrors.enteredReview = true;
      hasErrors = true;
    }
    if (!customerServiceRating) {
      newErrors.customerServiceRating = true;
      hasErrors = true;
    }
    if (!atmosphereRating) {
      newErrors.atmosphereRating = true;
      hasErrors = true;
    }
    if (!priceRating) {
      newErrors.priceRating = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setShowConfirmation(false);
    } else {
      // Prepare the review data to send to the server
      const reviewData = {
        userID: 1,
        movieID: selectedMovie.id,
        reviewTitle: enteredTitle,
        reviewContent: enteredReview,
        customerServiceRating: customerServiceRating,
        atmosphereRating: atmosphereRating,
        priceRating: priceRating
      };

      // Send the review data to the server using POST request
      callApiAddReview(reviewData)
        .then(res => {
          console.log("callApiAddReview response: ", res);
          setShowConfirmation(true);
          setErrors({});
        })
        .catch(error => {
          console.error("Error adding review:", error.message);
          // Handle any error that occurred during the review submission
        });
    }
  };

  const callApiAddReview = async (reviewData) => {
    const url = serverURL + "/api/addReview";
    console.log("Sending review data to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">Review a Restaurant</Typography>
      </Grid>
      <Grid item xs={12}>
        <MovieSelection
          movies={movies}
          selectedMovie={selectedMovie}
          handleMovieChange={handleMovieChange}
        />
        {errors.selectedMovie && <Typography color="red">Select your restaurant</Typography>}
      </Grid>
      <Grid item xs={12}>
        <ReviewTitle enteredTitle={enteredTitle} handleTitleChange={handleTitleChange} />
        {errors.enteredTitle && <Typography color="red">Enter your review title</Typography>}
      </Grid>
      <Grid item xs={12}>
        <ReviewBody enteredReview={enteredReview} handleReviewChange={handleReviewChange} />
        {errors.enteredReview && <Typography color="red">Enter your review</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Customer Service</Typography>
        <ReviewRating selectedRating={customerServiceRating} handleRatingChange={handleCustomerServiceRatingChange} />
        {errors.customerServiceRating && <Typography color="red">Select the rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Atmosphere</Typography>
        <ReviewRating selectedRating={atmosphereRating} handleRatingChange={handleAtmosphereRatingChange} />
        {errors.atmosphereRating && <Typography color="red">Select the rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Price</Typography>
        <ReviewRating selectedRating={priceRating} handleRatingChange={handlePriceRatingChange} />
        {errors.priceRating && <Typography color="red">Select the rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
      {showConfirmation && (
        <Grid item xs={12}>
          <Typography variant="h6">Your review has been received</Typography>
          <Typography variant="subtitle1">Movie: {selectedMovie.name}</Typography>
          <Typography variant="subtitle1">Review Title: {enteredTitle}</Typography>
          <Typography variant="subtitle1">Review Body: {enteredReview}</Typography>
          <Typography variant="subtitle1">Customer Service Rating: {customerServiceRating}</Typography>
          <Typography variant="subtitle1">Atmosphere Rating: {atmosphereRating}</Typography>
          <Typography variant="subtitle1">Price Rating: {priceRating}</Typography>
        </Grid>
      )}
    </Grid>
  );
}

export default Review;

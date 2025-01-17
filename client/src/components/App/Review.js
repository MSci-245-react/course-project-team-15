import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Typography, Button, TextField} from '@mui/material';
import ReviewTitle from './ReviewTitle';
import ReviewBody from './ReviewBody';
import ReviewRating from './ReviewRating';
import { v4 as uuidv4 } from 'uuid';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const serverURL = "";

function Review() {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantID, restaurantName, reviewData} = location.state || {};

  const [enteredTitle, setEnteredTitle] = useState(reviewData?.reviewTitle || '');
  const [enteredReview, setEnteredReview] = useState(reviewData?.reviewContent || '');
  const [overallRating, setOverallRating] = useState(reviewData?.overallRating || 0);
  const [customerServiceRating, setCustomerServiceRating] = useState(reviewData?.customerServiceRating || 0);
  const [foodQualityRating, setFoodQualityRating] = useState(reviewData?.foodQualityRating || 0);
  const [atmosphereRating, setAtmosphereRating] = useState(reviewData?.atmosphereRating || 0);
  const [priceRating, setPriceRating] = useState(reviewData?.priceRating || 0);
  const [cost, setCost] = useState(reviewData?.cost || '');
  const [photo, setPhoto] = useState(null);

  const isEditing = !!reviewData;

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const [totalSpent, setTotalSpent] = useState(0);

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

  const handleOverallRatingChange = (event) => {
    setOverallRating(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, customerServiceRating: false }));
    setShowConfirmation(false);
  };

  const handleCustomerServiceRatingChange = (event) => {
    setCustomerServiceRating(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, customerServiceRating: false }));
    setShowConfirmation(false);
  };
  const handleFoodQualityRatingChange = (event) => {
    setFoodQualityRating(event.target.value);
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

  const handleCostChange = (event) => {
    setCost(event.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, priceRating: false }));
    setShowConfirmation(false);
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]); 
    setErrors((prevErrors) => ({ ...prevErrors, photo: false }));
    setShowConfirmation(false);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });


  React.useEffect(() => {
  }, [reviewData, isEditing]);

  const handleSubmit = async () => {
    let hasErrors = false;
    const newErrors = {};

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
    if (!overallRating) {
      newErrors.overallRating = true;
      hasErrors = true;
    }
    if (!foodQualityRating) {
      newErrors.foodQualityRating = true;
      hasErrors = true;
    }
    if (!cost) {
      newErrors.cost = true;
      hasErrors = true;
    }
    if (photo === null) {
      newErrors.photo = false;
      hasErrors = false;
    }

    if (!hasErrors) {
      const reviewData = new FormData();
      reviewData.append('userID', 1);
      reviewData.append('restaurantID', restaurantID);
      reviewData.append('reviewTitle', enteredTitle);
      reviewData.append('reviewContent', enteredReview);
      reviewData.append('overallRating', overallRating);
      reviewData.append('customerServiceRating', customerServiceRating);
      reviewData.append('foodQualityRating', foodQualityRating);
      reviewData.append('atmosphereRating', atmosphereRating);
      reviewData.append('priceRating', priceRating);
      reviewData.append('cost', cost);

      if (photo) reviewData.append('photo', photo);

      const isEditingMode = isEditing; 
      const reviewId = reviewData?.id; 

      let endpoint = `${serverURL}/api/addRestaurantReview`;
      let method = "POST";
  
      if (isEditingMode && reviewId) {
        endpoint = `${serverURL}/api/editReview/${reviewId}`;
        method = "PUT";
      }
  
      try {
        const response = await fetch(endpoint, {
          method: method,
          body: reviewData,
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const body = await response.json();
        console.log("Review submission response: ", body);

        const saveReview = (reviewData) => {
          const existingReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
          const reviewIndex = existingReviews.findIndex(review => review.reviewId === reviewData.reviewId);
          if (reviewIndex !== -1) {
            existingReviews[reviewIndex] = reviewData;
          } else {
            reviewData.reviewId = uuidv4();
            existingReviews.push(reviewData);
          }
          localStorage.setItem('restaurantReviews', JSON.stringify(existingReviews));
        };

        if(body.success) {
          const reviewData = {
            reviewId: uuidv4(),
            restaurantID: restaurantID,
            restaurantName: restaurantName,
            reviewContent: enteredReview,
            overallRating: overallRating,
            customerServiceRating: customerServiceRating,
            foodQualityRating: foodQualityRating,
            atmosphereRating: atmosphereRating,
            priceRating: priceRating,
            cost: cost,
          };
          saveReview(reviewData)
        }
        
        setShowConfirmation(true);
        navigate(`/restaurant/${restaurantID}`);

      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">{isEditing ? `Edit Review for ${restaurantName}` : `Review ${restaurantName}`}</Typography>
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
        <Typography variant="h6">Overall Experience</Typography>
        <ReviewRating selectedRating={overallRating} handleRatingChange={handleOverallRatingChange} />
        {errors.overallRating && <Typography color="red">Select overall experience rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Food Quality</Typography>
        <ReviewRating selectedRating={foodQualityRating} handleRatingChange={handleFoodQualityRatingChange} />
        {errors.foodQualityRating && <Typography color="red">Select food quality rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Customer Service</Typography>
        <ReviewRating selectedRating={customerServiceRating} handleRatingChange={handleCustomerServiceRatingChange} />
        {errors.customerServiceRating && <Typography color="red">Select customer service rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Atmosphere</Typography>
        <ReviewRating selectedRating={atmosphereRating} handleRatingChange={handleAtmosphereRatingChange} />
        {errors.atmosphereRating && <Typography color="red">Select atmosphere rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Price</Typography>
        <ReviewRating selectedRating={priceRating} handleRatingChange={handlePriceRatingChange} />
        {errors.priceRating && <Typography color="red">Select price rating</Typography>}
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Cost of Your Order ($)"
          type="text"
          InputLabelProps={{
          shrink: true,
          }}
          variant="outlined"
          fullWidth
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
        {errors.cost && <Typography color="red">Please enter cost of your order</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" style={{ marginBottom: '8px' }}>Upload photo of your experience (Optional)</Typography>
        <Button
          variant="contained"
          component="label"
          style={{ color: 'white'}}
        >
          Upload Photo
          <input
            type="file"
            hidden
            onChange={handlePhotoChange}
          />
        </Button>
        {photo && <Typography style={{ marginTop: '8px' }}>{photo.name}</Typography>}
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" style={{ color: 'white'}} onClick={handleSubmit}>
          Submit Review
        </Button>
      </Grid>
      {showConfirmation && (
        <Grid item xs={12}>
          <Typography variant="h6">Your review has been received</Typography>
          <Typography variant="subtitle1">Restaurant Name: {restaurantID}</Typography>
          <Typography variant="subtitle1">Review Title: {enteredTitle}</Typography>
          <Typography variant="subtitle1">Review Body: {enteredReview}</Typography>
          <Typography variant="subtitle1">Overall Experience Rating: {overallRating}</Typography>
          <Typography variant="subtitle1">Food Quality Rating: {foodQualityRating}</Typography>
          <Typography variant="subtitle1">Customer Service Rating: {customerServiceRating}</Typography>
          <Typography variant="subtitle1">Atmosphere Rating: {atmosphereRating}</Typography>
          <Typography variant="subtitle1">Price Rating: {priceRating}</Typography>
          <Typography variant="subtitle1">Cost of Food: {cost}</Typography>
        </Grid>
      )}
    </Grid>
    </ThemeProvider>
  );
}

export default Review;

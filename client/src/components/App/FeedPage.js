import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Rating, Divider, Box, FormControl, MenuItem, Select, Switch, FormControlLabel, TextField, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CommentIcon from '@mui/icons-material/Comment';

function FeedPage() {
  const [trendingRestaurants, setTrendingRestaurants] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [filterRating, setFilterRating] = useState(0);
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterFollowedUsers, setFilterFollowedUsers] = useState(false);
  const [followedUserIds, setFollowedUserIds] = useState([]);
  const [sortByLikes, setSortByLikes] = useState(false);
  const [sortByTime, setSortByTime] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const [commentTexts, setCommentTexts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendingRestaurants();
    loadRecentReviews();
    loadFollowedUsers();
  }, []);

  const loadTrendingRestaurants = async () => {
    try {
      const response = await axios.get('/api/trendingRestaurants');
      setTrendingRestaurants(response.data);
    } catch (error) {
      console.error('Error loading trending restaurants:', error);
    }
  };

  const loadRecentReviews = async () => {
    try {
      const response = await axios.get('/api/recentReviews');
      const reviewsData = response.data;

      // Fetch comments for each review
      const reviewsWithComments = await Promise.all(reviewsData.map(async (review) => {
        const commentsResponse = await axios.get(`/api/comments/${review.id}`);
        const comments = commentsResponse.data;
        return { ...review, comments };
      }));

      setRecentReviews(reviewsWithComments);

      // Initialize like counts based on data from backend
      const initialLikeCounts = {};
      reviewsWithComments.forEach((review) => {
        initialLikeCounts[review.id] = review.likes;
      });
      setLikeCounts(initialLikeCounts);

      // Initialize comment texts
      const initialCommentTexts = {};
      reviewsWithComments.forEach((review) => {
        initialCommentTexts[review.id] = '';
      });
      setCommentTexts(initialCommentTexts);
    } catch (error) {
      console.error('Error loading recent reviews:', error);
    }
  };




  const loadFollowedUsers = async () => {
    try {
      const response = await axios.get('/api/followedUsers');
      setFollowedUserIds(response.data.map(user => user.id));
    } catch (error) {
      console.error('Error loading followed users:', error);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'rating':
        setFilterRating(value);
        break;
      case 'cuisine':
        setFilterCuisine(value);
        break;
      case 'followedUsers':
        setFilterFollowedUsers(event.target.checked);
        break;
      case 'sortByLikes':
        setSortByLikes(event.target.checked);
        break;
      case 'sortByTime':
        setSortByTime(event.target.checked);
        break;
      case 'timeFilter':
        setTimeFilter(value);
        break;
      default:
        break;
    }
  };

  const handleLike = async (reviewId) => {
    try {
      // Send a POST request to the backend to like the review
      await axios.post(`/api/likeReview/${reviewId}`);

      // Increment the like count in the state by 1
      setLikeCounts(prevLikeCounts => ({
        ...prevLikeCounts,
        [reviewId]: (prevLikeCounts[reviewId] || 0) + 1
      }));
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const handleComment = async (e, reviewId) => {
    e.preventDefault();
    console.log('Review ID:', reviewId);
    console.log('Comment Text:', commentTexts[reviewId]); // Log the comment text
    try {
      await axios.post(`/api/commentReview/${reviewId}`, { text: commentTexts[reviewId] });

      // After successfully adding the comment, reload recent reviews to display the updated data
      await loadRecentReviews();

      // Clear the comment text for the current review after adding the comment
      setCommentTexts(prevCommentTexts => ({
        ...prevCommentTexts,
        [reviewId]: ''
      }));
    } catch (error) {
      console.error('Error commenting on review:', error);
    }
  };


  return (
    <Container maxWidth="xl" style={{ padding: 0 }}>
      <Typography variant="h1" component="h1" align="center" style={{ margin: '20px 0' }}>
        Feed
      </Typography>

      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Box>
          <FormControl style={{ marginRight: '20px' }}>
            <Select
              value={filterRating}
              onChange={handleFilterChange}
              displayEmpty
              name="rating"
              placeholder="Rating"
            >
              <MenuItem value={0}>All Ratings</MenuItem>
              {[...Array(6).keys()].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating}+
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <Select
              value={filterCuisine}
              onChange={handleFilterChange}
              displayEmpty
              name="cuisine"
              placeholder="Cuisine"
            >
              <MenuItem value="">All Cuisines</MenuItem>
              <MenuItem value="American">American</MenuItem>
              <MenuItem value="Italian">Italian</MenuItem>
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Mexican">Mexican</MenuItem>
              <MenuItem value="Middle Eastern">Middle Eastern</MenuItem>
              <MenuItem value="African">African</MenuItem>
              <MenuItem value="Greek">Greek</MenuItem>
              <MenuItem value="Asian">Asian</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <FormControlLabel
            control={<Switch checked={filterFollowedUsers} onChange={handleFilterChange} name="followedUsers" />}
            label="Followed Users"
          />
          <FormControlLabel
            control={<Switch checked={sortByLikes} onChange={handleFilterChange} name="sortByLikes" />}
            label="Sort by Likes"
          />
          <FormControlLabel
            control={<Switch checked={sortByTime} onChange={handleFilterChange} name="sortByTime" />}
            label="Sort by Time"
          />
          {sortByTime && (
            <FormControl>
              <Select
                value={timeFilter}
                onChange={handleFilterChange}
                displayEmpty
                name="timeFilter"
                placeholder="Time Filter"
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="this_week">This Week</MenuItem>
                <MenuItem value="this_month">This Month</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      <Grid container spacing={3} style={{ padding: '20px' }}>
        <Grid item xs={12} md={6} style={{ borderRight: '1px solid #ccc', paddingRight: '30px' }}>
          <Typography variant="h3" component="h2" align="center">
            Trending Restaurants
          </Typography>
          <Divider style={{ margin: '10px 0' }} />
          <Grid container spacing={3}>
            {trendingRestaurants
              .filter((restaurant) => (
                (filterRating === 0 || restaurant.rating >= filterRating) &&
                (!filterCuisine || restaurant.Categories.toLowerCase().includes(filterCuisine.toLowerCase()))
              ))
              .map((restaurant) => (
                <Grid item xs={6} key={restaurant.id}>
                  <Card onClick={() => handleCardClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={restaurant.FeaturedImage}
                      alt={restaurant.Name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {restaurant.Name}
                      </Typography>
                      <Box display="flex" alignItems="center" my={2}>
                        <Rating name="read-only" value={restaurant.rating || 0} readOnly />
                        <Typography variant="subtitle1" ml={1}>
                          {restaurant.rating ? restaurant.rating.toFixed(1) : 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.Description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} style={{ paddingLeft: '30px' }}>
          <Typography variant="h3" component="h2" align="center">
            Recent Reviews
          </Typography>
          <Divider style={{ margin: '10px 0' }} />
          <Grid container spacing={3}>
            {recentReviews
              .filter((review) => (
                (!filterFollowedUsers || followedUserIds.includes(review.userId)) &&
                (filterRating === 0 || review.overallRating >= filterRating)
              ))
              .sort((a, b) => (sortByLikes ? b.likes - a.likes : 0))
              .map((review) => (
                <Grid item xs={12} key={review.id}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {review.reviewTitle}
                      </Typography>
                      <Rating name="read-only" value={review.overallRating || 0} readOnly />
                      <Typography variant="body2" color="text.secondary" style={{ maxHeight: '3.6em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {review.reviewContent}
                      </Typography>

                      {/* Comment Text Field Section */}
                      <Box display="flex" alignItems="center">
                        <form onSubmit={(e) => handleComment(e, review.id)} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', width: '100%' }}>
                          <TextField
                            value={commentTexts[review.id]}
                            onChange={(e) => setCommentTexts(prevCommentTexts => ({ ...prevCommentTexts, [review.id]: e.target.value }))}
                            variant="standard"
                            margin="dense"
                            required
                            fullWidth
                            id={`comment-${review.id}`}
                            label="Add a comment"
                            name={`comment-${review.id}`}
                            size="small"
                          />
                          <IconButton type="submit" color="primary" style={{ marginBottom: '-25px' }}>
                            <CommentIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleLike(review.id)} style={{ marginBottom: '-25px', marginLeft: '200px' }}>
                            <ThumbUpAltIcon />
                          </IconButton>
                          <Typography variant="body1">{likeCounts[review.id]}</Typography>
                        </form>
                      </Box>

                      {/* Comment Section */}
                      <Box mt={2} mb={1}>
                        <Typography variant="h7">Comments:</Typography>
                        {review.comments && review.comments.map((comment, index) => (
                          <Typography key={index} style={{ fontSize: '0.8rem', marginTop: '5px' }}>{comment.text}</Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

              ))}

          </Grid>
        </Grid>
      </Grid>

      <Divider style={{ margin: '30px auto', width: '80%' }} />
    </Container>
  );
}

export default FeedPage;

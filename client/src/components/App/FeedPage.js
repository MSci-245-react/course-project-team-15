import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Rating, Divider, Box, FormControl, MenuItem, Select, Switch, FormControlLabel, RadioGroup, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
       const reviewsWithLikes = response.data.map(review => ({ ...review, likes: Math.floor(Math.random() * 100) }));
       let filteredReviews = reviewsWithLikes;

       // Filter by time if a time filter is selected
       if (timeFilter !== 'all') {
         const currentDate = new Date();
         switch (timeFilter) {
           case 'today':
             filteredReviews = filteredReviews.filter(review => {
               const reviewDate = new Date(review.date); 
               return reviewDate.toDateString() === currentDate.toDateString();
             });
             break;
           case 'this_week':
             const startOfWeek = new Date(currentDate);
             startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
             startOfWeek.setHours(0, 0, 0, 0);
             filteredReviews = filteredReviews.filter(review => {
               const reviewDate = new Date(review.date);
               return reviewDate >= startOfWeek;
             });
             break;
           case 'this_month':
             const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
             startOfMonth.setHours(0, 0, 0, 0);
             filteredReviews = filteredReviews.filter(review => {
               const reviewDate = new Date(review.date);
               return reviewDate >= startOfMonth;
             });
             break;
           default:
             break;
         }
       }

       setRecentReviews(filteredReviews);
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

   return (
     <Container maxWidth="xl" style={{ padding: 0 }}>
       <Typography variant="h1" component="h1" align="center" style={{ margin: '20px 0' }}>
         Feed
       </Typography>

       {/* Filtering options */}
       <Box display="flex" justifyContent="space-between" marginBottom="20px">
         {/* Restaurant-related filters */}
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

         {/* Review-related filters */}
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

       {/* Trending Restaurants Section */}
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

         {/* Recent Reviews Section */}
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

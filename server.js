import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';
import cors from 'cors';
import multer from 'multer';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://msci342-team-15-default-rtdb.firebaseio.com"
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

// Middleware to verify Firebase ID Token
const checkAuth = (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
  return res.status(403).send('Unauthorized');
  }
  admin.auth().verifyIdToken(idToken)
  .then(decodedToken => {
  req.user = decodedToken;
  next();
  }).catch(error => {
  res.status(403).send('Unauthorized');
  });
  };


// API to add user survery to the database
app.post('/api/survey', (req, res) => {
	const { userID, cuisinePreferences, dietaryRestrictions, mealPreferences, budget, ambiancePreference, diningFrequency, healthImportance, allergies } = req.body;
	let connection = mysql.createConnection(config);
  
	const sql = `INSERT INTO Survey (userID, cuisinePreferences, dietaryRestrictions, mealPreferences, budget, ambiancePreference, diningFrequency, healthImportance, allergies) 
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
	const data = [userID, JSON.stringify(cuisinePreferences), JSON.stringify(dietaryRestrictions), mealPreferences, budget, ambiancePreference, diningFrequency, healthImportance, allergies];
  
	connection.query(sql, data, (error, results, fields) => {
	  if (error) {
		console.error("Error adding survey:", error.message);
		return res.status(500).json({ error: "Error adding survey to the database" });
	  }
  
	  return res.status(200).json({ success: true, message: "Survey data successfully added" });
	});
	connection.end();
});

// API to get all restaurants from the database
app.get('/api/restaurants', (req, res) => {
    let connection = mysql.createConnection(config);

    const sql = `SELECT Name as name, Description as description, Fulladdress, AverageRating as rating, FeaturedImage, Price, Categories, Latitude, Longitude, Street, id FROM Restaurants`;

    connection.query(sql, (error, results) => {
        if (error) {
            return console.error(error.message);
        }
        res.json(results);
    });
    connection.end();
});

// API to get a specific restaurant from the database
app.get('/api/restaurants/:id', (req, res) => {
    let connection = mysql.createConnection(config);
    const { id } = req.params; // Extract `id` from URL parameters

    const sql = `SELECT Name, Description, Categories, About, Fulladdress, AverageRating as rating, Latitude, Longitude, Website, Price, OpeningHours, FeaturedImage, id FROM Restaurants WHERE id = ?`;

    connection.query(sql, [id], (error, results) => { 
        if (error) {
            return console.error(error.message);
        }
        res.json(results[0] || {}); 
    });
    connection.end();
});

// API to add a restaurant review to the database
// app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' }); 
// API to add a restaurant review to the database
app.post('/api/addRestaurantReview', upload.single('photo'), (req, res) => {
  let connection = mysql.createConnection(config);

  const { userID, restaurantID, reviewTitle, reviewContent, overallRating, customerServiceRating, foodQualityRating, atmosphereRating, priceRating, cost } = req.body;
  const photoURL = req.file ? req.file.path : null;
  
  // Increment ReviewCount for the user making the review
  const updateUserReviewCount = `UPDATE Users SET ReviewCount = ReviewCount + 1 WHERE UserID = ?`;

  connection.query(updateUserReviewCount, [userID], (error, results) => {
    if (error) {
      console.error("Error updating user review count:", error.message);
      return res.status(500).json({ error: "Error updating user review count in the database" });
    }
  });

  const sql = `INSERT INTO RestaurantReviews (userID, restaurantID, reviewTitle, reviewContent, overallRating, customerServiceRating, foodQualityRating, atmosphereRating, valueForMoneyRating, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const data = [userID, restaurantID, reviewTitle, reviewContent, overallRating, customerServiceRating, foodQualityRating, atmosphereRating, priceRating, cost];

  connection.query(sql, data, (error, results) => {
    if (error) {
      console.error("Error adding restaurant review:", error.message);
      return res.status(500).json({ error: "Error adding restaurant review to the database" });
    }

    return res.status(200).json({ success: true, message: "Restaurant review successfully added", reviewID: results.insertId });
  });
  connection.end();
});


// update restaurant review table when edit it
app.put('/api/editReview/:reviewId', upload.single('photo'), (req, res) => {
  const { reviewId } = req.params;
  const {userID, restaurantID, reviewTitle, reviewContent, overallRating, customerServiceRating, foodQualityRating, atmosphereRating, priceRating, cost} = req.body;

  const photoURL = req.file ? req.file.path : null;

  const sql = `UPDATE RestaurantReviews SET reviewTitle = ?, reviewContent = ?, overallRating = ?, customerServiceRating = ?, foodQualityRating = ?, 
  atmosphereRating = ?, valueForMoneyRating = ?, cost = ? ${photoURL ? ', photoURL = ?' : ''} WHERE id = ?`;

  const data = [reviewTitle, reviewContent, overallRating, customerServiceRating, foodQualityRating, atmosphereRating, priceRating, cost];

  if (photoURL) {
    data.push(photoURL);
  }

  data.push(reviewId);

  let connection = mysql.createConnection(config);
  connection.query(sql, data, (error, results) => {
      if (error) {
          console.error("Error updating restaurant review:", error.message);
          return res.status(500).json({ error: "Error updating restaurant review in the database" });
      }

      return res.status(200).json({ success: true, message: "Restaurant review successfully updated" });
  });
  connection.end();
});

app.get('/api/trendingRestaurants', (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `
    SELECT
      r.id,
      r.Name,
      r.Description,
      r.Categories,
      r.About,
      r.Fulladdress,
      r.AverageRating AS rating,
      r.Latitude,
      r.Longitude,
      r.Website,
      r.Price,
      r.OpeningHours,
      r.FeaturedImage
    FROM
      Restaurants r
    LEFT JOIN
      RestaurantReviews rr ON r.id = rr.restaurantID
    GROUP BY
      r.id
    ORDER BY
      rating DESC,
      r.id DESC
    LIMIT 10;`;

  connection.query(sql, (error, results) => {
    if (error) {
      return console.error(error.message);
    }
    res.json(results);
  });
  connection.end();
});


// API to get recent reviews from the database
app.get('/api/recentReviews', (req, res) => {
  let connection = mysql.createConnection(config);

  // Query to fetch recent reviews
  const sql = `
      SELECT
          rr.*,
          r.name AS restaurantName,
          u.username AS reviewerUsername
      FROM
          RestaurantReviews rr
      JOIN
          Restaurants r ON rr.restaurantID = r.id
      JOIN
          Users u ON rr.userID = u.UserID
      ORDER BY
          rr.id DESC
      LIMIT 10;`;

  connection.query(sql, (error, results) => {
      if (error) {
          console.error(error.message);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
  });
  connection.end();
});

// API to get followed users from the database
app.get('/api/followedUsers', (req, res) => {
  let connection = mysql.createConnection(config);

  const sql = `SELECT UserID AS id FROM Users`;

  connection.query(sql, (error, results) => {
      if (error) {
          console.error(error.message);
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
  });
  connection.end();
});

// API to like a review
app.post('/api/likeReview/:reviewId', (req, res) => {
  const { reviewId: id } = req.params; // Rename reviewId to id

  const connection = mysql.createConnection(config);

  const sql = `UPDATE RestaurantReviews SET likes = likes + 1 WHERE id = ?`;

  connection.query(sql, [id], (error, results) => {
    connection.end();

    if (error) {
      console.error('Error liking review:', error.message);
      return res.status(500).json({ error: 'Error liking review' });
    }

    return res.status(200).json({ success: true, likes: results.changedRows });
  });
});

// API to comment on a review
app.post('/api/commentReview/:reviewId', (req, res) => {
  const { reviewId } = req.params;
  const { text } = req.body;

  const connection = mysql.createConnection(config);

  const sql = `INSERT INTO ReviewComments (reviewID, text) VALUES (?, ?)`;

  connection.query(sql, [parseInt(reviewId), text], (error, results) => {
    connection.end();

    if (error) {
      console.error('Error commenting on review:', error.message);
      return res.status(500).json({ error: 'Error commenting on review' });
    }

    return res.status(200).json({ success: true, message: 'Comment added successfully' });
  });
});

// API to get comments for a specific review
app.get('/api/comments/:reviewId', (req, res) => {
  const { reviewId } = req.params;

  const connection = mysql.createConnection(config);

  const sql = `SELECT * FROM ReviewComments WHERE reviewID = ?`;

  connection.query(sql, [parseInt(reviewId)], (error, results) => {
    connection.end();

    if (error) {
      console.error('Error fetching comments:', error.message);
      return res.status(500).json({ error: 'Error fetching comments' });
    }

    return res.status(200).json(results);
  });
});

app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  // Create a single connection to the database
  const connection = mysql.createConnection(config);

  // Check if userId is null or not a number
  if (userId === null || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  // Query to fetch UserID, ReviewCount, and BadgeLevel for the specified user
  const sql = `SELECT UserID, ReviewCount FROM Users WHERE UserID = ?`;

  // Execute the query
  connection.query(sql, [userId], (error, results) => {
    // Close the connection after the query is executed
    connection.end();

    if (error) {
      console.error('Error fetching user data:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Check if user data was found
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data
    const userData = results[0];
    res.json(userData);
  });
});


// API to register a new user
app.post('/api/register', async (req, res) => {
  const { username, email, password, firstName, lastName, uid } = req.body;

  // Check if username or email already exists
  const userExistsQuery = 'SELECT COUNT(*) AS count FROM Users WHERE Username = ? OR Email = ?';
  let connection = mysql.createConnection(config);
  connection.query(userExistsQuery, [username, email], (error, results) => {
    if (error) {
      console.error('Error checking if user exists:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Insert user information into the Users table
    const insertUserQuery = 'INSERT INTO Users (Username, Email, Password, FirstName, LastName, FirebaseUID) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(insertUserQuery, [username, email, password, firstName, lastName, uid], (error, results) => {
      connection.end(); // Close the database connection
      if (error) {
        console.error('Error inserting user into database:', error.message);
        return res.status(500).json({ error: 'Error registering user' });
      }
      return res.status(200).json({ success: true, message: 'User registered successfully' });
    });
  });
});

app.get('/api/user-info/:uid', (req, res) => {
  const { uid } = req.params;
  let connection = mysql.createConnection(config);

  console.log('UID extracted from request:', uid);
  const query = 'SELECT FirebaseUID, FirstName, LastName, Email FROM Users WHERE FirebaseUID = ?';

  connection.query(query, [uid], (error, results) => {
    connection.end(); 
    if (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({ error: "Error fetching user details from the database" });
    }
    if (results.length > 0) {
      const user = results[0];
      console.log('User details fetched successfully:', user);
      res.json({
        success: true,
        message: "User details fetched successfully",
        user: {
          uid: user.FirebaseUID,
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.Email
        }
      });
    } else {
      console.log('User not found for UID:', uid);
      res.status(404).json({ success: false, message: "User not found" });
    }
  });
});


app.get('/api/cuisine-preference/:userId', (req, res) => {
  const { userId } = req.params;
  let connection = mysql.createConnection(config);
  const query = 'SELECT CuisinePreferences, DietaryRestrictions, MealPreferences, Budget FROM Survey WHERE UserID = ?';

  // Query to fetch the user's cuisine preference
  const preferenceQuery = 'SELECT CuisinePreferences FROM Survey WHERE UserID = ?';
  
  connection.query(preferenceQuery, [userId], (error, preferencesResults) => {
    if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (preferencesResults.length === 0) {
      return res.status(404).json({ error: 'User preferences not found' });
    }

    // Extract the cuisine preference from the results
    const cuisinePreference = preferencesResults[0].CuisinePreferences.replace(/["]+/g, '');
    console.log(`Cuisine Preference: ${cuisinePreference}`);

    const restaurantQuery = `
    SELECT Name, Description, Fulladdress, AverageRating as rating, FeaturedImage, Price, Categories, id 
    FROM Restaurants 
    WHERE Categories LIKE CONCAT('%', ?, '%')`;

    connection.query(restaurantQuery, [`%${cuisinePreference}%`], (error, restaurantsResults) => {
      if (error) {
        console.error('Error fetching restaurants:', error);
        connection.end();
        return res.status(500).json({ error: 'Internal server error fetching restaurants' });
      }
      const response = {
        cuisinePreference: cuisinePreference,
        restaurants: restaurantsResults
      };
      res.json(response);
      console.log(response);
      connection.end();
    });
  });
});

app.get('/api/dietary-restrictions/:userId', (req, res) => {
  const { userId } = req.params;
  let connection = mysql.createConnection(config);

  const dietaryRestrictionQuery = 'SELECT DietaryRestrictions FROM Survey WHERE UserID = ?';

  connection.query(dietaryRestrictionQuery, [userId], (error, preferencesResults) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (preferencesResults.length === 0) {
      connection.end();
      return res.status(404).json({ error: 'User preferences not found' });
    }

    const dietaryRestrictions = preferencesResults[0].DietaryRestrictions.replace(/["]+/g, '');

    const restaurantQuery = `
      SELECT Name, Description, Fulladdress, AverageRating as rating, FeaturedImage, Price, Categories, id 
      FROM Restaurants 
      WHERE Categories LIKE CONCAT('%', ?, '%')`;

    connection.query(restaurantQuery, [`%${dietaryRestrictions}%`], (error, restaurantsResults) => {
      connection.end();
      if (error) {
        console.error('Error fetching restaurants based on dietary restrictions:', error);
        return res.status(500).json({ error: 'Internal server error fetching restaurants' });
      }

      const response = {
        dietaryRestrictions: dietaryRestrictions,
        restaurants: restaurantsResults
      };

      res.json(response);
    });
  });
});

app.get('/api/meal-preference/:userId', (req, res) => {
  const { userId } = req.params;
  let connection = mysql.createConnection(config);

  const mealPreferencesQuery = 'SELECT MealPreferences FROM Survey WHERE UserID = ?';

  connection.query(mealPreferencesQuery, [userId], (error, preferencesResults) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (preferencesResults.length === 0) {
      connection.end();
      return res.status(404).json({ error: 'User preferences not found' });
    }

    const mealPreferences = preferencesResults[0].MealPreferences.replace(/["]+/g, '');

    const restaurantQuery = `
      SELECT Name, Description, Fulladdress, AverageRating as rating, FeaturedImage, Price, Categories, id 
      FROM Restaurants 
      WHERE Categories LIKE CONCAT('%', ?, '%')`;

    connection.query(restaurantQuery, [`%${mealPreferences}%`], (error, restaurantsResults) => {
      connection.end();
      if (error) {
        console.error('Error fetching restaurants based on dietary restrictions:', error);
        return res.status(500).json({ error: 'Internal server error fetching restaurants' });
      }

      const response = {
        mealPreferences: mealPreferences,
        restaurants: restaurantsResults
      };

      res.json(response);
    });
  });
});

app.get('/api/budget/:userId', (req, res) => {
  const { userId } = req.params;
  let connection = mysql.createConnection(config);

  const budgetQuery = 'SELECT Budget FROM Survey WHERE UserID = ?';

  connection.query(budgetQuery, [userId], (error, preferencesResults) => {
    if (error) {
      connection.end();
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (preferencesResults.length === 0) {
      connection.end();
      return res.status(404).json({ error: 'User preferences not found' });
    }

    const budget = preferencesResults[0].Budget.replace(/["]+/g, '');

    const restaurantQuery = `
      SELECT Name, Description, Fulladdress, AverageRating as rating, FeaturedImage, Price, Categories, id 
      FROM Restaurants 
      WHERE Price LIKE CONCAT('%', ?, '%')`;

    connection.query(restaurantQuery, [`%${budget}%`], (error, restaurantsResults) => {
      connection.end();
      if (error) {
        console.error('Error fetching restaurants based on dietary restrictions:', error);
        return res.status(500).json({ error: 'Internal server error fetching restaurants' });
      }

      const response = {
        budget: budget,
        restaurants: restaurantsResults
      };
      res.json(response);
    });
  });
});

app.get('/api/survey-results/:uid', (req, res) => {
  const { uid } = req.params;
  const connection = mysql.createConnection(config);

  const query = `
    SELECT 
      CuisinePreferences, 
      DietaryRestrictions, 
      MealPreferences, 
      Budget, 
      AmbiancePreference, 
      DiningFrequency, 
      HealthImportance, 
      Allergies 
    FROM Survey 
    WHERE UserID = ?`;

  connection.query(query, [uid], (error, results) => {
    if (error) {
      console.error('Error fetching survey results:', error);
      connection.end();
      return res.status(500).json({ error: 'Internal server error fetching survey results' });
    }

    if (results.length > 0) {
      const surveyResult = results[0];
      const removeQuotes = str => str.replace(/^"(.+(?="$))"$/, '$1');
      const response = {
        cuisinePreference: removeQuotes(surveyResult.CuisinePreferences),
        dietaryRestrictions: removeQuotes(surveyResult.DietaryRestrictions),
        mealPreference: surveyResult.MealPreferences,
        budget: surveyResult.Budget,
        ambiancePreference: surveyResult.AmbiancePreference,
        diningFrequency: surveyResult.DiningFrequency,
        healthImportance: surveyResult.HealthImportance,
        allergies: surveyResult.Allergies
      };
      res.json(response);
    } else {
      res.status(404).json({ message: 'Survey results not found for this user.' });
    }
    connection.end();
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version

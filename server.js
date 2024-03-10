import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));

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

    const sql = `SELECT Name as name, Description as description, Fulladdress, AverageRating as rating, FeaturedImage, id FROM Restaurants`;

    connection.query(sql, (error, results) => {
        if (error) {
            return console.error(error.message);
        }
        res.json(results);
    });
    connection.end();
});

// API to add a review to the database
// app.post('/api/addReview', (req, res) => {
// 	const { userID, movieID, reviewTitle, reviewContent, reviewScore } = req.body;

// 	let connection = mysql.createConnection(config);

// 	const sql = `INSERT INTO Review (userID, movieID, reviewTitle, reviewContent, reviewScore) 
// 				 VALUES (?, ?, ?, ?, ?)`;

// 	const data = [userID, movieID, reviewTitle, reviewContent, reviewScore];

// 	connection.query(sql, data, (error, results, fields) => {
// 		if (error) {
// 			console.error("Error adding review:", error.message);
// 			return res.status(500).json({ error: "Error adding review to the database" });
// 		}

// 		return res.status(200).json({ success: true });
// 	});
// 	connection.end();
// });


app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version

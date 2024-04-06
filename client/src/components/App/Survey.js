import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography,TextField, Button, Slider, FormControl, InputLabel, Select, MenuItem, FormLabel, FormHelperText} from '@mui/material';
import { getAuth } from 'firebase/auth';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Survey() {
    const serverURL = "http://localhost:3000";
    const [cuisinePreferences, setCuisinePreferences] = useState([]);
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const [mealPreferences, setMealPreferences] = useState('');
    const [budget, setBudget] = useState('');
    const [ambiancePreference, setAmbiancePreference] = useState('');
    const [diningFrequency, setDiningFrequency] = useState('');
    const [healthImportance, setHealthImportance] = useState(3);
    const [allergies, setAllergies] = useState('');

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const theme = createTheme({
        palette: {
          primary: {
            main: '#FFA500',
          },
        },
      });

    const handleSubmit = async (event) => {
        event.preventDefault();

        const auth = getAuth();
        const user = auth.currentUser;
        const userID = user.uid;

        if (validateForm()) {
            const surveyData = {
                cuisinePreferences,
                dietaryRestrictions,
                mealPreferences,
                budget,
                ambiancePreference,
                diningFrequency,
                healthImportance,
                allergies,
                userID,
            };
            await callApiAddSurvey(surveyData);
            navigate('/');
        }
    };

    const callApiAddSurvey = async (surveyData) => {
        const budgetRanges = ["$", "$$", "$$$", "$$$$"];
        surveyData.budget = budgetRanges[surveyData.budget - 1];

        const url = serverURL + "/api/survey";
        console.log("Sending survey data to:", url);

        const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",

        },
        body: JSON.stringify(surveyData),
        });

        if (response.ok) {
        const responseData = await response.json();
        console.log("Survey data submitted successfully:", responseData);
        } else {
        console.error("Failed to submit survey data");
        }
    };

    const validateForm = () => {
        let valid = true;
        const errors = {};

        if (cuisinePreferences.length === 0) {
            errors.cuisinePreferences = 'Please select at least one cuisine';
            valid = false;
        }

        if (dietaryRestrictions.length == 0) {
            errors.dietaryRestrictions = 'Please select any dietary restrictions';
            valid = false;
        }

        if (mealPreferences.length == 0) {
            errors.mealPreferences = 'Please select a meal preference';
            valid = false;
        }

        if (ambiancePreference.length == 0) {
            errors.ambiancePreference = 'Please select a ambiance preference';
            valid = false;
        }

        if (diningFrequency.length == 0) {
            errors.diningFrequency = 'Please select a dining frequency';
            valid = false;
        }

        if (allergies.length == 0) {
            errors.allergies = 'Please write any allergies or none ';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    return (
        <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
        <Typography variant="h2" align="center" gutterBottom>User Survey</Typography>
        <form onSubmit={handleSubmit}>
            
            {/* Cuisine Preferences */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="cuisine-label">Cuisine</InputLabel>
                <Select 
                    labelId="cuisine-label"
                    id="cuisine-select"
                    value={cuisinePreferences} 
                    label="Cuisine" 
                    onChange={(e) => setCuisinePreferences(e.target.value)}
                    error={!!errors.cuisinePreferences}>
                        <MenuItem value="Italian">Italian</MenuItem>
                        <MenuItem value="Mexican">Mexican</MenuItem>
                        <MenuItem value="Indian">Indian</MenuItem>
                        <MenuItem value="American">American</MenuItem>
                        <MenuItem value="Middle Eastern">Middle Eastern</MenuItem>
                        <MenuItem value="African">African</MenuItem>
                        <MenuItem value="Greek">Greek</MenuItem>
                        <MenuItem value="Asian">Asian</MenuItem>
                </Select>
                <FormHelperText error>{errors.cuisinePreferences}</FormHelperText>
            </FormControl>

            {/* Dietary Restrictions */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="dietary-label">Dietary</InputLabel>
                <Select 
                    labelId="dietary-label"
                    id="dietary-select"
                    value={dietaryRestrictions} 
                    label="Dietary" 
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
                    error={!!errors.dietaryRestrictions}>
                        <MenuItem value="Vegan">Vegan</MenuItem>
                        <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                        <MenuItem value="Halal">Halal</MenuItem>
                        <MenuItem value="Gluten-free">Gluten-free</MenuItem>
                        <MenuItem value="None">None</MenuItem>
                </Select>
                <FormHelperText error>{errors.dietaryRestrictions}</FormHelperText>
            </FormControl>

            {/* Meal Preferences */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="meal-label">Meal Preferences</InputLabel>
                <Select 
                    labelId="meal-label"
                    id="meal-select"
                    value={mealPreferences} 
                    label="Meal Preferences" 
                    onChange={(e) => setMealPreferences(e.target.value)}
                    error={!!errors.mealPreferences}>
                        <MenuItem value="Breakfast">Breakfast</MenuItem>
                        <MenuItem value="Brunch">Brunch</MenuItem>
                        <MenuItem value="Lunch">Lunch</MenuItem>
                        <MenuItem value="Dinner">Dinner</MenuItem>
                </Select>
                <FormHelperText error>{errors.mealPreferences}</FormHelperText>
            </FormControl>

            {/* Budget */} 
            <FormControl fullWidth margin="normal">
                <FormLabel>Budget Per Meal</FormLabel>
                <Slider
                    value={Number(budget)}
                    onChange={(e, newValue) => setBudget(newValue)}
                    aria-labelledby="budget-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={3}
                    valueLabelFormat={(value) => ["$", "$$", "$$$"][value - 1]}
                />
                </FormControl>

            {/* Ambiance Preference */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="ambiance-label">Ambiance Preferences</InputLabel>
                <Select 
                    labelId="ambiance-label"
                    id="ambiance-select"
                    value={ambiancePreference} 
                    label="Ambiance Preferences" 
                    onChange={(e) => setAmbiancePreference(e.target.value)}
                    error={!!errors.ambiancePreference}>
                        <MenuItem value="Fine Dining">Fine Dining</MenuItem>
                        <MenuItem value="Cafe">Cafe</MenuItem>
                        <MenuItem value="Fast-Food">Fast Food</MenuItem>
                </Select>
                <FormHelperText error>{errors.ambiancePreference}</FormHelperText>
            </FormControl> 

            {/* Dining Frequency */} 
            <FormControl fullWidth margin="normal">
                <InputLabel id="dining-label">Dining Frequency</InputLabel>
                <Select 
                    labelId="dining-label"
                    id="dining-select"
                    value={diningFrequency} 
                    label="Dining Frequency" 
                    onChange={(e) => setDiningFrequency(e.target.value)}
                    error={!!errors.diningFrequency}>
                        <MenuItem value="Daily">Daily</MenuItem>
                        <MenuItem value="Once a week">Once a week</MenuItem>
                        <MenuItem value="Few times a month">Few times a month</MenuItem>
                </Select>
                <FormHelperText error>{errors.diningFrequency}</FormHelperText>
            </FormControl> 

            {/* Health and Nutrition */}
            <Typography gutterBottom>Health and Nutrition Importance</Typography>
            <Slider
                value={healthImportance}
                onChange={(e, newValue) => setHealthImportance(newValue)}
                aria-labelledby="health-importance-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={5}
            />

            {/* Allergies */}
            <TextField
                fullWidth
                label="Allergies"
                margin="normal"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                error={!!errors.allergies}
            />
            <FormHelperText error>{errors.allergies}</FormHelperText>
        
            <Button type="submit" variant="contained" color="primary"  style={{ color: 'white' }}>Submit</Button>
        </form>
        </Container>
        </ThemeProvider>
    );
}

export default Survey;
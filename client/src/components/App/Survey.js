import React, { useState } from 'react';
import { Container, Typography,TextField, Button, Slider, FormControl, InputLabel, Select, MenuItem, FormLabel} from '@mui/material';

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

  const handleCheckboxChange = (state, setState) => (event) => {
    const { value, checked } = event.target;
    setState(
      checked ? [...state, value] : state.filter((item) => item !== value)
    );
  };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const surveyData = {
            cuisinePreferences,
            dietaryRestrictions,
            mealPreferences,
            budget,
            ambiancePreference,
            diningFrequency,
            healthImportance,
            allergies,
        };

        await callApiAddSurvey(surveyData);
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

    return (
        <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>User Survey</Typography>
        <form onSubmit={handleSubmit}>
            
            {/* Cuisine Preferences */}
            <FormControl fullWidth margin="normal">
            <InputLabel>Cuisine</InputLabel>
            <Select value={cuisinePreferences} label="Cuisine" onChange={(e) => setCuisinePreferences(e.target.value)}>
                <MenuItem value="Italian">Italian</MenuItem>
                <MenuItem value="Mexican">Mexican</MenuItem>
            </Select>
            </FormControl>

            {/* Dietary Restrictions */}
            <FormControl fullWidth margin="normal">
            <InputLabel>Dietary</InputLabel>
            <Select value={dietaryRestrictions} label="Dietary" onChange={(e) => setDietaryRestrictions(e.target.value)}>
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
            </Select>
            </FormControl>

            {/* Meal Preferences */}
            <FormControl fullWidth margin="normal">
            <InputLabel>Meal Preferences</InputLabel>
            <Select value={mealPreferences} label="Meal Preferences" onChange={(e) => setMealPreferences(e.target.value)}>
                <MenuItem value="Breakfast">Breakfast</MenuItem>
                <MenuItem value="Lunch">Lunch</MenuItem>
                <MenuItem value="Dinner">Dinner</MenuItem>
            </Select>
            </FormControl>

            {/* Budget */} 
            <FormControl fullWidth margin="normal">
            <FormLabel>Budget Per Meal</FormLabel>
            <Slider
                value={budget}
                onChange={(e, newValue) => setBudget(newValue)}
                aria-labelledby="budget-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={4}
                valueLabelFormat={(value) => ["$", "$$", "$$$", "$$$$"][value - 1]}
            />
            </FormControl>

            {/* Ambiance Preference */}
            <FormControl fullWidth margin="normal">
            <InputLabel>Ambiance Preferences</InputLabel>
            <Select value={ambiancePreference} label="Ambiance Preferences" onChange={(e) => setAmbiancePreference(e.target.value)}>
                <MenuItem value="Fine Dining">Fine Dining</MenuItem>
                <MenuItem value="Cafe">Cafe</MenuItem>
                <MenuItem value="Fast Food">Fast Food</MenuItem>
            </Select>
            </FormControl> 

            {/* Dining Frequency */} 
            <FormControl fullWidth margin="normal">
            <InputLabel>Dining Frequency</InputLabel>
            <Select value={diningFrequency} label="Dining Frequency" onChange={(e) => setDiningFrequency(e.target.value)}>
                <MenuItem value="Daily">Daily</MenuItem>
                <MenuItem value="Once a week">Once a week</MenuItem>
                <MenuItem value="Few times a month">Few times a month</MenuItem>
            </Select>
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
            />
        
            <Button type="submit" variant="contained" color="primary">Submit</Button>
        </form>
        </Container>
    );
}

export default Survey;
import React from 'react';
import { Button } from '@mui/material';

const ReportRestaurant = () => {
  const handleFormClick = () => {
    //We use a google form here as from a MANAGEMENT ENGINEERING perspective, it is more feasible.
    //We can easily store this info in SQL but there's no point since we won't be reusing the info again in this code 
    //Also, it is easier for a person to access and read responses in a form than SQL
    
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSfrX0VKJXCA5KDnpjc5iltT_huYLY2rQxdNsGJGDWu-clI5Fg/viewform?usp=sf_link";
  };

  return (
    <div>
      <h1>Complete this Form to Report a Restaurant!</h1>
      <Button variant="contained" onClick={handleFormClick}>
        Complete this Form
      </Button>
    </div>
  );
};

export default ReportRestaurant;

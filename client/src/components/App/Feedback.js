import React from 'react';
import { Button } from '@mui/material';

const Feedback = () => {
  const handleFormClick = () => {
    //We use a google form here as from a MANAGEMENT ENGINEERING perspective, it is more feasible.
    //We can easily store this info in SQL but there's no point since we won't be reusing the info again in this code 
    //Also, it is easier for a person to access and read responses in a form than SQL

    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSdpikl8f9_M_VztnR3OOzLNswq7vtNJeOszKQLrKiWY6NNB1w/viewform?usp=sf_link";
  };

  return (
    <div>
      <h1>Complete this Form to Send Us Feedback!</h1>
      <Button variant="contained" onClick={handleFormClick}>
        Complete this Form
      </Button>
    </div>
  );
};

export default Feedback;

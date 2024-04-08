import React from 'react';
import { Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ReportBug = () => {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#FFA500',
      },
    },
  });

  const handleFormClick = () => {
    //We use a google form here as from a MANAGEMENT ENGINEERING perspective, it is more feasible.
    //We can easily store this info in SQL but there's no point since we won't be reusing the info again in this code 
    //Also, it is easier for a person to access and read responses in a form than SQL

    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSeJvHqZvzZbqqNJo518asKG8eGpKqa7SaB2HHRWuk1YDPtJpw/viewform?usp=sf_link";
  };

  return (
    <ThemeProvider theme={theme}>
    <div>
      <h1>Complete this Form to Report a Bug!</h1>
      <Button variant="contained" onClick={handleFormClick} style={{ color: 'white'}}>
        Complete this Form
      </Button>
    </div>
    </ThemeProvider>
  );
};

export default ReportBug;
import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { withFirebase } from '../Firebase';

const Landing = () => {
    const navigate = useNavigate();
    const onNavigateToSignInPage = () => {
        navigate('/SignIn');
    };
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item>
                <Typography variant={'h6'} component="div" style={{ margin: '20px 0' }}>
                    MSci 342 - App with Firebase authentication
                </Typography>
                <Typography component="div" style={{ margin: '20px 0' }}>
                    You are on the Landing page.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onNavigateToSignInPage}
                    fullWidth
                >
                    Go to Sign In Page
                </Button>
            </Grid>
        </Grid>
    );
};
export default withFirebase(Landing);
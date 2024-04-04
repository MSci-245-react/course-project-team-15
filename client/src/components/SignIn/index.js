import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { withFirebase } from '../Firebase';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ firebase }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await firebase.doSignInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  return (
    <Grid container>
      <Grid item>
        <Container>
          <Typography>
            MSci 342 - App with Firebase authentication
          </Typography>
          <Typography>
            You are on the Sign In page.
          </Typography>
          <form noValidate onSubmit={onSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              value={email}
              onChange={onChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              value={password}
              onChange={onChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            {error && (
              <Typography color="error">
                {error.message}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Container>
      </Grid>
    </Grid>
  );
};

export default withFirebase(SignIn);

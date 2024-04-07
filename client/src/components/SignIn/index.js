import React, { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import { withFirebase } from '../Firebase';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './background5.jpg'; // Import your background image

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

  const onNavigateToCreateAccount = () => {
    navigate('/CreateAccount'); // Assuming your route to create account is '/signup'
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})`, height: '100vh', backgroundSize: '100% 100%', backgroundPosition: 'center' }}>
      <Container component="main" maxWidth="xs" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '8px' }}>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && <Typography color="error">{error.message}</Typography>}
        <form noValidate onSubmit={onSubmit}>
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={onChange}
            margin="normal"
            fullWidth
            variant="outlined"
            autoComplete="email"
            autoFocus
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={onChange}
            margin="normal"
            fullWidth
            variant="outlined"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          <Button
            onClick={onNavigateToCreateAccount}
            fullWidth
            variant="text"
          >
            Create Account
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default withFirebase(SignIn);

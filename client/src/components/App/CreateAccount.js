import React, { useState } from 'react';
import { Grid, Typography, TextField, Button, IconButton, InputAdornment, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function CreateAccount() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [passwordRequirements, setPasswordRequirements] = useState([
    'Password must be 5 - 32 characters long',
    'Password must have at least one capital letter',
    'Password must have at least one number',
  ]);
  const [hidePassword, setHidePassword] = useState(true);

  const navigate = useNavigate();

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);

    if (newUsername.length < 3 || newUsername.length > 32) {
      setErrors(['Username must be 3 - 32 characters long']);
    } else if (existingUsernames.includes(newUsername)) {
      setErrors(['Username must be unique']);
    } else {
      setErrors([]);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleValidateFields = () => {
    const errors = [];
    if (!firstName) {
      errors.push('First Name is required');
    }
    if (!lastName) {
      errors.push('Last Name is required');
    }
    if (!username) {
      errors.push('Username is required');
    }
    if (!password) {
      errors.push('Password is required');
    }
    if (!confirmPassword) {
      errors.push('Confirm Password is required');
    }
    if (!email) {
      errors.push('Email is required');
    }
    return errors;
  };

  const handleSubmit = () => {
    const errors = handleValidateFields();
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    if (existingUsernames.includes(username)) {
      setErrors(['Username must be unique']);
      return;
    }

    const unmetRequirements = [];
    if (password !== confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }

    if (!validatePassword(password, unmetRequirements)) {
      setErrors(unmetRequirements);
      return;
    }

    // Here you would handle the submission of the account creation form
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);

    // Assuming account creation was successful, navigate to the survey page
    navigate('/Survey');
  };

  const validatePassword = (password, unmetRequirements) => {
    const minLength = 5;
    const maxLength = 32;
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength || password.length > maxLength) {
      unmetRequirements.push('Password must be 5 - 32 characters long');
    }
    if (!hasCapitalLetter) {
      unmetRequirements.push('Password must have at least one capital letter');
    }
    if (!hasNumber) {
      unmetRequirements.push('Password must have at least one number');
    }

    return unmetRequirements.length === 0;
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3">Create Account</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          value={lastName}
          onChange={handleLastNameChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={handleUsernameChange}
          error={errors.includes('Username must be 3 - 32 characters long') || errors.includes('Username must be unique')}
          helperText={errors.includes('Username must be 3 - 32 characters long') || errors.includes('Username must be unique') ? 'Username must be 3 - 32 characters long and must be unique' : ''}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          variant="outlined"
          type={hidePassword ? 'password' : 'text'}
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          helperText={
            <List dense>
              {passwordRequirements.map((requirement, index) => (
                <ListItem key={index}>{requirement}</ListItem>
              ))}
            </List>
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {hidePassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Account
        </Button>
      </Grid>
      {errors.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="body2" color="error">
            <List dense>
              {errors.map((errorMessage, index) => (
                <ListItem key={index}>{errorMessage}</ListItem>
              ))}
            </List>
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

const existingUsernames = ['test', 'Mason'];

export default CreateAccount;

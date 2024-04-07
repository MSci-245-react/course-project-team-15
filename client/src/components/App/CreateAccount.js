import React, { useState, useEffect  } from 'react';
import { Grid, Typography, TextField, Button, IconButton, InputAdornment, List, ListItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { FirebaseContext } from '../Firebase';

const auth = getAuth();

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
  const [existingUsernames, setExistingUsernames] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing usernames from the backend API
    const fetchExistingUsernames = async () => {
      try {
        const response = await fetch('/api/existingUsernames');
        if (response.ok) {
          const data = await response.json();
          setExistingUsernames(data);
        } else {
          console.error('Failed to fetch existing usernames');
        }
      } catch (error) {
        console.error('Error fetching existing usernames:', error);
      }
    };

    fetchExistingUsernames();
  }, []);

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
    } else {
      // Check if the new username already exists in the list of existing usernames
      if (existingUsernames.includes(newUsername)) {
        setErrors(['Username must be unique']);
      } else {
        setErrors([]);
      }
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

  const callApiRegisterUser = async (userDetails) => {
    const url = "/api/register"; // Adjust the URL path according to your API endpoint
    console.log("Registering user at URL:", url);
    console.log("Sending userDetails to backend:", userDetails);
    
    try {
      const response = await axios.post(url, {
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.password,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        uid: userDetails.uid,
      });

      if (response.status !== 200) {
        throw new Error(response.data.error || "Error registering user");
      }

      console.log('Successfully registered user');
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error.message);
      throw error;
    }
  };

  const handleSubmit = async () => {
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
  
    try {
      // Create a new user account with the provided email and password using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Successfully created Firebase account:', user.uid);
  
      // Now, call your backend API to insert the user details into the MySQL database
      await callApiRegisterUser({
        username,
        email,
        password,
        firstName,
        lastName,
        uid: user.uid,
      });
  
      // Navigate to the survey page after successful account creation
      navigate('/Survey');
    } catch (error) {
      console.error('Error during account creation:', error.message);
      setErrors([error.message]);
    }
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



export default CreateAccount;

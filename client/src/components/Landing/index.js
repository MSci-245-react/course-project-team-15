import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { withFirebase } from '../Firebase';

const Landing = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Navigate to the Sign In page as soon as the component mounts
        navigate('/SignIn');
    }, [navigate]); 

    return null;
};

export default withFirebase(Landing);

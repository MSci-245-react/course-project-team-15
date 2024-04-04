import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../SignIn';
import LandingPage from '../Landing';
import HomePage from '../Home';
const PrivateRoute = ({ authenticated }) => {
    return (
        <Routes>
            <Route
                path="/"
                element={authenticated ? <HomePage /> : <LandingPage />}
            />
            <Route
                path="/SignIn"
                element={authenticated ? <Navigate replace to="/" /> : <SignIn />}
            />
            {/* Add other routes here */}
        </Routes>
    );
};
export default PrivateRoute;
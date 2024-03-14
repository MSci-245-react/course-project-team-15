import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Container, Typography, Button } from '@mui/material';
import pinIcon from './../../assets/images/pin.png';

function Map() {
    const [restaurants, setRestaurants] = useState([]);
    const [reviews, setReviews] = useState([]); 
    const navigate = useNavigate();

    React.useEffect(() => {
        loadRestaurants();
    }, []);

    const customIcon = new L.Icon({
        iconUrl: pinIcon,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const loadRestaurants = async () => {
        const url = "/api/restaurants";
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched Restaurants:', data);
            setRestaurants(data);
        } catch (error) {
            console.error("Failed to load restaurants: ", error);
        }
    };

    const handleRestaurantClick = (id) => {
        navigate(`/restaurant/${id}`);
    };

      React.useEffect(() => {
        const loadedReviews = JSON.parse(localStorage.getItem('restaurantReviews')) || [];
        setReviews(loadedReviews);
  }, []);

    const handleReviewClick = (reviewId) => {
        const reviewToEdit = reviews.find(review => review.reviewId === reviewId);
        navigate('/review', { state: {reviewData: reviewToEdit, restaurantName: reviewToEdit.restaurantName} });
      };

    return (
        <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
            Restaurants in Waterloo
        </Typography>
        <MapContainer center={[43.4723, -80.5449]} zoom={13} style={{ height: "650px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {restaurants.map((restaurant) => (
                <Marker
                    key={restaurant.id}
                    position={[restaurant.Latitude, restaurant.Longitude]}
                    icon={customIcon}
                >
                    <Popup>
                        <Typography>{restaurant.name}</Typography>
                        <Typography>{restaurant.description}</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handleRestaurantClick(restaurant.id)}
                            style={{ marginTop: '10px' }}
                            >
                            More Detail
                        </Button>
                        {restaurant.hasReview && (
                        <Button variant="contained" color="secondary" onClick={() => handleReviewClick(restaurant.id)} style={{ marginTop: '10px', marginLeft: '10px' }}>
                            View Review
                        </Button>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </Container>
    );
}

export default Map;

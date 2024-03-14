import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Container, Typography, TextField, Button } from '@mui/material';
import pinIcon from './../../assets/images/pin.png';

function Map() {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [mapCenter, setMapCenter] = useState([]);

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
            setFilteredRestaurants(data);
        } catch (error) {
            console.error("Failed to load restaurants: ", error);
        }
    };

    const handleRestaurantClick = (id) => {
        navigate(`/restaurant/${id}`);
    };

    const handleSearch = () => {
        const matchedRestaurants = restaurants.filter(restaurant =>
            restaurant.Street.toLowerCase().includes(searchText.toLowerCase()) ||
            restaurant.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredRestaurants(matchedRestaurants);
        if (matchedRestaurants.length > 0) {
            setMapCenter([matchedRestaurants[0].Latitude, matchedRestaurants[0].Longitude]);
        }
    };
    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Find Restaurant</Typography>
            <TextField 
                label="Search by Address or Name" 
                variant="outlined" 
                fullWidth 
                value={searchText} 
                onChange={(e) => setSearchText(e.target.value)} 
                style={{ marginBottom: '10px' }}
            />
        <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginBottom: '20px' }}>Search</Button>
        <MapContainer center={[43.4723, -80.5449]} zoom={13} style={{ height: "600px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredRestaurants.map((restaurant) => (
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
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </Container>
    );
}

export default Map;

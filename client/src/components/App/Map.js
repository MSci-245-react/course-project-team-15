import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Container, Typography } from '@mui/material';
import pinIcon from './../../assets/images/pin.png';

function Map() {
    const [restaurants, setRestaurants] = useState([]);

    React.useEffect(() => {
        loadRestaurants();
    }, []);

    const customIcon = new L.Icon({
        iconUrl: pinIcon,
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
        popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
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
                        {restaurant.name}<br />
                        {restaurant.description}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </Container>
    );
}

export default Map;

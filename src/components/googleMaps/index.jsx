import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import useGeolocation from '../../hooks/geolocation';
import { io } from "socket.io-client";

const MAP_LIBRARIES = ['marker'];

const GoogleMaps = () => {
    const { latitude, longitude, setPosition } = useGeolocation();
    const [map, setMap] = useState(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAVThnZ4hg9FWDB7-T0ZB5e2QcvyaFY8Y4",
        libraries: MAP_LIBRARIES
    })

    useEffect(() => {
        const socket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: Infinity, // Permite tentativas infinitas de reconexão
            timeout: 10000, // Tempo de espera para estabelecer a conexão (em ms)
            reconnectionDelay: 1000, // Tempo de espera antes da próxima tentativa de reconexão (em ms)
            reconnectionDelayMax: 5000 // Tempo máximo de espera entre as tentativas de reconexão (em ms)
        });

        socket.on('locationBroadcast', (data) => {
            console.log(data)
            setPosition((prevLocations) => ({
                ...prevLocations,
                latitude: data.latitude,
                longitude: data.longitude
                // [data.deviceId]: { latitude: data.latitude, longitude: data.longitude },
            }));
        });

        return () => {
            socket.disconnect(); // Desconecta do servidor WebSocket
        };
    }, [])

    useEffect(() => {
        if (isLoaded && map) {
            // Verificar se a biblioteca de marcadores está carregada
            if (google.maps && google.maps.marker) {
                // Criar um conteúdo HTML como um elemento DOM
                const contentElement = document.createElement('div');
                // Renderizar o ícone do Material-UI no elemento DOM
                const root = createRoot(contentElement);
                root.render(<LocationOnIcon style={{ fontSize: 40, color: 'red' }} />);

                new google.maps.marker.AdvancedMarkerElement({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    content: contentElement, // Usar o elemento DOM como conteúdo
                });
            } else {
                console.error('google.maps.marker library is not loaded.');
            }
        }
    }, [isLoaded, map, latitude, longitude]);

    return isLoaded && latitude && longitude ? (
        <>
            <h1>Maps</h1>
            <GoogleMap
                center={{ lat: latitude, lng: longitude }}
                zoom={15}
                onLoad={mapInstance => {
                    mapInstance.setCenter({ lat: latitude, lng: longitude });
                    setMap(mapInstance);
                }}
                onUnmount={mapInstance => {
                    setMap(null);
                }}
                mapContainerStyle={{ width: '100%', height: '400px' }}
                options={{
                    mapId: 'maps-433916' // Adicione o Map ID aqui
                }}
            >
                <></>
            </GoogleMap>
        </>
    ) : <div>Loading...</div>;
}

export default GoogleMaps
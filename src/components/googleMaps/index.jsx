import React, { useContext, useEffect, useRef } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { createRoot } from 'react-dom/client';
import { MapsContext } from '../../context/maps';

const GoogleMaps = () => {
    const mapRef = useRef(null); // Referência para o elemento HTML onde o mapa será carregado
    const googleMapRef = useRef(null); // Referência para o mapa Google
    const directionsRendererRef = useRef(null); // Referência para o DirectionsRenderer
    const markerRef = useRef(null);
    const { googleMapsLoaded } = useContext(MapsContext);
    
    useEffect(() => {
        if (googleMapsLoaded) {
            initMap();
        }
    }, [googleMapsLoaded]);

    const initMap = async () => {
        // Carrega a biblioteca de marcadores
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        // Inicializa o mapa no elemento referenciado
        googleMapRef.current = new google.maps.Map(mapRef.current, {
            center: { lat: -25.5000789, lng: -49.2740144 },
            zoom: 15,
            mapId: 'maps-433916' // Seu Map ID, se aplicável
        });

        const currentMoverMarkerElement = document.createElement('div');
        const currentMoverMarkerRoot = createRoot(currentMoverMarkerElement);
        currentMoverMarkerRoot.render(<DirectionsCarIcon style={{ fontSize: 40, color: 'green' }} />);

        markerRef.current = new AdvancedMarkerElement({
            position: { lat: -25.5000789, lng: -49.2740144 },
            map: googleMapRef.current,
            content: currentMoverMarkerElement
        });

        // Adiciona o marcador da localização atual
        const currentLocationElement = document.createElement('div');
        const currentLocationRoot = createRoot(currentLocationElement);
        currentLocationRoot.render(<LocationOnIcon style={{ fontSize: 40, color: 'red' }} />);

        // new AdvancedMarkerElement({
        //     position: { lat: -25.5000789, lng: -49.2740144 },
        //     map: googleMapRef.current,
        //     content: currentLocationElement
        // });

        // Adiciona o marcador do destino
        const destinationElement = document.createElement('div');
        const destinationRoot = createRoot(destinationElement);
        destinationRoot.render(<LocationOnIcon style={{ fontSize: 40, color: 'blue' }} />);

        // new AdvancedMarkerElement({
        //     position: { lat: -25.4947, lng: -49.2767 },
        //     map: googleMapRef.current,
        //     content: destinationElement
        // });

        // Cria o DirectionsService e DirectionsRenderer
        const directionsService = new google.maps.DirectionsService();
        directionsRendererRef.current = new google.maps.DirectionsRenderer();
        directionsRendererRef.current.setMap(googleMapRef.current);

        // Define as posições de origem e destino
        const origin = { lat: -25.5000789, lng: -49.2740144 };
        const destination = { lat: -25.4947, lng: -49.2767 };

        // Solicita a rota
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING // Modo de transporte
        }, (response, status) => {
            if (status === 'OK') {
                directionsRendererRef.current.setDirections(response);
                simulateMovement(response.routes[0]);
            } else {
                console.error('Directions request failed due to ' + status);
            }
        });
    };

    const simulateMovement = (route) => {
        const steps = route.legs[0].steps;
        let stepIndex = 0;
        let segmentIndex = 0;
        const totalSegments = 100; // Define o número total de segmentos para suavidade do movimento

        const moveMarker = () => {
            if (stepIndex < steps.length) {
                const startLocation = steps[stepIndex].start_location;
                const endLocation = steps[stepIndex].end_location;

                // Calcula a fração da distância para este segmento
                const latDiff = (endLocation.lat() - startLocation.lat()) / totalSegments;
                const lngDiff = (endLocation.lng() - startLocation.lng()) / totalSegments;

                // Calcula a nova posição intermediária
                const nextPosition = {
                    lat: startLocation.lat() + (latDiff * segmentIndex),
                    lng: startLocation.lng() + (lngDiff * segmentIndex),
                };

                // Atualiza a posição do marcador existente
                markerRef.current.position = nextPosition;

                // const currentMoverMarkerElement = document.createElement('div');
                // const currentMoverMarkerRoot = createRoot(currentMoverMarkerElement);
                // currentMoverMarkerRoot.render(<DirectionsCarIcon style={{ fontSize: 40, color: 'green' }} />);

                // // Cria um novo marcador na nova posição
                // markerRef.current = new google.maps.marker.AdvancedMarkerElement({
                //     position: nextPosition,
                //     map: googleMapRef.current,
                //     content: currentMoverMarkerElement
                // });

                // Verifica se chegamos ao final deste step
                if (segmentIndex < totalSegments) {
                    segmentIndex++;
                } else {
                    segmentIndex = 0;
                    stepIndex++;
                }

                setTimeout(moveMarker, 100); // Mover a cada 100ms para suavidade
            }
        };

        moveMarker();
    };

    return (
        <div>
            <h1>Maps</h1>
            <div
                ref={mapRef}
                style={{ width: '100%', height: '400px' }}
            />
        </div>
    );
};

export default GoogleMaps;

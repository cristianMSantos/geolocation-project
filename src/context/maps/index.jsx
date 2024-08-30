import { createContext, useState } from "react";
import React, { useEffect, useRef } from 'react';

export const MapsContext = createContext(null);

const MapsProvider = ({ children }) => {
    const scriptLoadedRef = useRef(false); // Referência para verificar se o script foi carregado
    const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

    const loadGoogleMapsScript = (callback) => {
        const existingScript = document.getElementById('googleMaps');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAVThnZ4hg9FWDB7-T0ZB5e2QcvyaFY8Y4&libraries=places,marker`;
            script.id = 'googleMaps';
            script.async = true;
            script.onload = () => {
                if (callback) callback();
            };
            document.body.appendChild(script);
        } else {
            // Script já foi carregado, apenas chamar o callback
            if (callback) callback();
        }

    };

    useEffect(() => {
        if (!scriptLoadedRef.current) {
            loadGoogleMapsScript(() => {
                scriptLoadedRef.current = true;
                setGoogleMapsLoaded(true);
                console.log('Google Maps script loaded');
            });
        }
    }, []);

    return (
        <MapsContext.Provider
            value={{
                googleMapsLoaded
            }}
        >
            {children}
        </MapsContext.Provider>
    )
}

export default MapsProvider;
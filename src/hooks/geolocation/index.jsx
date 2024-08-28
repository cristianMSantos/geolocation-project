import { useEffect } from "react"
import { useState } from "react"
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const useGeolocation = () => {
    const [position, setPosition] = useState({ latitude: null, longitude: null })

    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Estabelecer a conexão com o servidor Socket.io
        const newSocket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        // Limpar a conexão quando o componente for desmontado
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const geo = navigator.geolocation

        if (!geo) {
            console.error('Geolocation is not supported by your browser');
            return;
        }

        const watcher = geo.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords

                socket.emit('locationUpdate', {
                    latitude,
                    longitude,
                    deviceId: 'unique-device-id', // um identificador único para o dispositivo
                });

                setPosition({ latitude, longitude })
            },
            (err) => console.error(err),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        )
        return () => geo.clearWatch(watcher);
    }, [socket])

    return { ...position, setPosition }
}

export default useGeolocation
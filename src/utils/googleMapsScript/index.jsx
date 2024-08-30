const loadGoogleMapsScript = (callback) => {
    const existingScript = document.getElementById('googleMaps');

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places,marker`;
        script.id = 'googleMaps';
        script.async = true;
        script.onload = () => {
            if (callback) callback();
        };
        document.body.appendChild(script);
    } else {
        if (callback) callback();
    }
};

export default loadGoogleMapsScript
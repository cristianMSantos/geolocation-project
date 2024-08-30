import GoogleMaps from "../../components/googleMaps"
import MapsProvider from "../../context/maps"

export const Home = () => {
    return (
        <>
            <MapsProvider>
                <GoogleMaps />
            </MapsProvider>
        </>
    )
}
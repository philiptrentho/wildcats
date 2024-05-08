import React, { useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];
const googleMapsApiKey = "AIzaSyD5Y7aH2VhUwYzbdcWM3BOvuoEYVopqGFE";

function LocationInput({ onSelect, location }) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey,
        libraries,
    });
    const [autocompleteInstance, setAutocompleteInstance] = useState(null);

    const handlePlaceSelect = () => {
        if (autocompleteInstance) {
            const place = autocompleteInstance.getPlace();
            if (place && place.geometry) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                onSelect(place.formatted_address, lat, lng);
            } else {
                console.log("Selected place has no geometry");
            }
        }
    };

    const handleLoad = (autocomplete) => {
        setAutocompleteInstance(autocomplete);
    };

    return (
        <div>
            {isLoaded ? (
                <Autocomplete
                    onLoad={handleLoad}
                    onPlaceChanged={handlePlaceSelect}>
                    <input
                        className="location-picker"
                        placeholder="Enter Location"
                        style={{ width: 200 }}
                        defaultValue={location}
                    />
                </Autocomplete>
            ) : <div>Loading...</div>}
        </div>
    );
}

export default LocationInput;

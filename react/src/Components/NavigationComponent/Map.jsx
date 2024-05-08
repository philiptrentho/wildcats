import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../utilities/firebase';

const containerStyle = {
  width: '385px',
  height: '94vh'
};

const center = {
  lat: 42.0565,
  lng: -87.6753
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
  return new Date(dateString).toLocaleString('en-US', options);
};

const MapView = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyD5Y7aH2VhUwYzbdcWM3BOvuoEYVopqGFE" // Replace with your actual API key
  });

  const [events, setEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState({ events: [], index: 0 });
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(firestore, "events"));
      const eventsData = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.latitude && data.longitude) {
          const key = `${data.latitude},${data.longitude}`;
          if (!eventsData[key]) {
            eventsData[key] = [];
          }
          eventsData[key].push({
            latitude: data.latitude,
            longitude: data.longitude,
            ...data
          });
        }
      });
      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  const handleMarkerClick = (key) => {
    const firstEvent = events[key][0];
    setInfoWindowPosition({ lat: firstEvent.latitude, lng: firstEvent.longitude });
    setSelectedEvent({ events: events[key], index: 0 });
  };

  const handleInfoWindowClose = () => {
    setInfoWindowPosition(null);
    setSelectedEvent({ events: [], index: 0 });
  };

  const handleNavigation = (direction) => {
    let newIndex = selectedEvent.index + direction;
    const currentEvents = selectedEvent.events;
    if (newIndex >= 0 && newIndex < currentEvents.length) {
      setSelectedEvent({ events: currentEvents, index: newIndex });
      setInfoWindowPosition({ lat: currentEvents[newIndex].latitude, lng: currentEvents[newIndex].longitude });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ flex: 1 }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        styles={mapStyles}
      >
        {Object.keys(events).map((key, index) => {
          const [lat, lng] = key.split(",");
          return (
            <Marker
              key={index}
              position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
              onClick={() => handleMarkerClick(key)}
            />
          );
        })}

        {infoWindowPosition && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={handleInfoWindowClose}
          >
            <div style={{ padding: '10px' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>{selectedEvent.events[selectedEvent.index].eventName}</strong>
              </div>
              <div style={{ fontStyle: 'italic', marginBottom: '10px' }}>
                {formatDate(selectedEvent.events[selectedEvent.index].eventStart)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                {selectedEvent.events[selectedEvent.index].eventDesc}
              </div>
              {selectedEvent.events[selectedEvent.index].eventPhoto && (
                <img
                  src={selectedEvent.events[selectedEvent.index].eventPhoto}
                  alt="Event"
                  style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }}
                />
              )}
              {selectedEvent.events.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button onClick={() => handleNavigation(-1)} disabled={selectedEvent.index === 0}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: '5px 10px'
                    }}>
                    ←
                  </button>
                  <button onClick={() => handleNavigation(1)} disabled={selectedEvent.index === selectedEvent.events.length - 1}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      padding: '5px 10px'
                    }}>
                    →
                  </button>
                </div>
              )}

            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapView;

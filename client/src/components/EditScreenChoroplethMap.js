import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useHistory } from 'react-router-dom';
import { GlobalStoreContext } from '../store';

const ChoroplethEditScreen = () => {
  const [map, setMap] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionProperties, setRegionProperties] = useState({});
  const { store } = useContext(GlobalStoreContext);
  const history = useHistory();

  useEffect(() => {
    const mapInstance = L.map('choropleth-map').setView([0, 0], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);
    renderGeoJSON(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      // Update the region properties in the store
      store.updateRegionProperties(selectedRegion, regionProperties);

      // Highlight the selected region on the map
      map.eachLayer((layer) => {
        if (layer.feature && layer.feature.id === selectedRegion) {
          layer.setStyle({ color: 'red', fillColor: 'orange' });
        } else {
          layer.setStyle({ color: 'blue', fillColor: 'lightblue' });
        }
      });
    }
  }, [selectedRegion, regionProperties, map, store]);

  const handleMapClick = (e) => {
    // Get the clicked layer
    const clickedLayer = e.target;
  
    // Get the index of the clicked layer
    const index = map.currentMap.getLayerId(clickedLayer);
  
    // Set the selected region and its properties
    setSelectedRegion(index);
    setRegionProperties(store.getRegionProperties(index));
  };
  

  useEffect(() => {
    if (map) {
      // Add an event listener for map click
      map.on('click', handleMapClick);

      // Add GeoJSON features to the map
      store.currentMap.mapObjects.features.forEach((feature, index) => {
        const geojsonLayer = L.geoJSON(feature, {
          style: {
            color: 'blue',
            fillColor: 'lightblue',
          },
        }).addTo(map);

        // Attach the GeoJSON feature id (using index) to the layer for identification
        geojsonLayer.feature = { id: index };
      });
    }

    return () => {
      if (map) {
        map.off('click', handleMapClick);
      }
    };
  }, [map, store.currentMap]);

  const handleRegionPropertyChange = (event, propertyName) => {
    // Update the regionProperties state
    setRegionProperties({
      ...regionProperties,
      [propertyName]: event.target.value,
    });
  };

  const renderGeoJSON = (map) => {
    if (map) {
      const thisMap = map;

      try {
        const geojsonData = store.currentMap.mapObjects;
        const geojsonLayer = L.geoJSON(geojsonData, {
          style: {
            color: 'blue',
            fillColor: 'lightblue',
          },
          onEachFeature: function (feature, layer) {
            // Attach the GeoJSON feature id (using index) to the layer for identification
            layer.feature = { id: store.currentMap.mapObjects.features.indexOf(feature) };

            // Add a click event listener to the layer
            layer.on('click', (event) => {
              handleMapClick(event);
            });
          },
        }).addTo(thisMap);

        // Get the bounds of the GeoJSON layer
        const geojsonBounds = geojsonLayer.getBounds();

        // Set the map view to the bounds of the GeoJSON layer
        thisMap.fitBounds(geojsonBounds);
      } catch (error) {
        console.error('Error rendering GeoJSON:', error);
      }
    }
  };

  function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  const handleExit = () => {
    history.push('/');
  };

  return (
    <div id="choropleth-edit-container">
      <div id="choropleth-controls">
        {selectedRegion && (
          <>
            <h4>Edit Properties for Region {selectedRegion}</h4>
            {Object.keys(regionProperties).map((property) => (
              <TextField
                key={property}
                label={property}
                value={regionProperties[property]}
                onChange={(e) => handleRegionPropertyChange(e, property)}
              />
            ))}
          </>
        )}
        <Button onClick={handleExit}>Exit</Button>
      </div>
      <div id="choropleth-map" style={{ height: '500px' }} />
    </div>
  );
};

export default ChoroplethEditScreen;

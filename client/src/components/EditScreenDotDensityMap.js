import React, { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import L from 'leaflet';
import { useHistory } from 'react-router-dom';
import { MenuItem } from '@mui/material';

const DotDensityEditScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const [intensity, setIntensity] = useState(0);
  const [map, setMap] = useState(null);
  const [densityOption, setDensityOption] = useState('population'); // Default option
  const [allDotPoints, setAllDotPoints] = useState([]);
  const history2 = useHistory();
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dotColor, setDotColor] = useState('red');

  useEffect(() => {
    const mapInstance = L.map('heatmap-map').setView([0, 0], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);
    renderGeoJSON(mapInstance);

    // Check if there are existing points in store.currentMap.dotArray
    if (store.currentMap.dotArray && store.currentMap.dotArray.length > 0) {
        const markers = store.currentMap.dotArray.map(point => L.circleMarker(point, { radius: 0.1, color: dotColor }));
        const markerLayer = L.layerGroup(markers);
        mapInstance.addLayer(markerLayer);
    }
        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, allDotPoints);


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


    const handleIntensityChange = (event) => {
        console.log("intensity: ", event.target.value);
        setIntensity(event.target.value);
        console.log("intensity1: ", intensity);
    };

    const handleDensityOptionChange = (event) => {
        console.log(event.target.value);
        setDensityOption(event.target.value);
    };


    const handleGenerate = () => {
        if (!map) return; // Ensure map is available
    
        let markerArray = [];
        const layerBoundsArray = [];

    
        map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer); // Remove existing markers
        }
        if (layer.getBounds) {
            const layerBounds = layer.getBounds();
            if (layerBounds.isValid()) {
              layerBoundsArray.push(layerBounds);
            }
        }
        console.log(layerBoundsArray);
        });
    
        store.currentMap.mapObjects.features.forEach((feature) => {
            let densityValue;
            if (densityOption == 'Population'){
                densityValue = feature.properties.pop_est;
            } else {
                densityValue = feature.properties.gdp_md;
            }
        
        const dotsCount = Math.round(densityValue / intensity);
        console.log(densityValue);
        console.log(dotsCount);
        const bounds = L.geoJSON(feature).getBounds();
    
        //to create an array of random points.
        const randomPoints = Array.from({ length: dotsCount }, () => generateRandomPoint(bounds));
        markerArray = [...markerArray, ...randomPoints];
        setAllDotPoints(markerArray);
        console.log("ramdom:",randomPoints);
        console.log(markerArray);

        // Create a layer group with all markers
        const markers = L.layerGroup(randomPoints.map(point => L.circleMarker(point, { radius: 0.5, color: dotColor })));

        // Add the layer group to the map
        markers.addTo(map);
        });
    }

    const handleSave =() =>{
        console.log(allDotPoints);
        store.saveDotArray(store.currentMap._id, allDotPoints)
        setAllDotPoints([]);
        history2.push('/');
    }

    const handleExit =() =>{
        history2.push('/');
    }

    //genrate random points in the bounds
    const generateRandomPoint = (bounds) => {
        const randomLat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
        const randomLng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
      
        return [randomLat, randomLng];
    };

    const handleClearPoints = () => {
        // Remove all existing layers
        if (map) {
            map.eachLayer((layer) => {
                if (layer instanceof L.CircleMarker) {
                    map.removeLayer(layer);
                }
            });
        }
    
        // Clear the clicked points and last clicked point
        setAllDotPoints([]);
        // Clear undo and redo history
    };

    const handleColorChange = (event) => {
        setDotColor(event.target.value);
      };
    


  return (
    <div id="dotdensity-edit-container">
      <div id="dotdenisty-controls">
        <TextField
          label="Intensity"
          type="number"
          value={intensity}
          onChange={handleIntensityChange}
        />
        <TextField
          select
          label="Density Option"
          value={densityOption}
          onChange={handleDensityOptionChange}
        >
          <MenuItem value="population">Population</MenuItem>
          <MenuItem value="gdp">GDP</MenuItem>
        </TextField>

        <input
              type="color"
              value={dotColor}
              onChange={handleColorChange}
              style={{ width: '50px', height: '30px', borderRadius: '10%', cursor: 'pointer' }}
        />

        <Button onClick={handleGenerate}> Generate </Button>
        <Button onClick={handleClearPoints}>Clear Points</Button>
        <Button > Undo </Button>
        <Button > Redo </Button>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={handleExit}>Exit</Button>
      </div>
      <div id="heatmap-map" style={{ height: '500px' }} />
      <p>
        {densityOption === 'population'
        ? `1 point = ${intensity} population`
        : `1 point = ${intensity} GDP`
        }
  </p>
    </div>
  );
};

export default DotDensityEditScreen;
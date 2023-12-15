import React, { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import { useHistory } from 'react-router-dom';

const HeatmapEditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [clickedPoints, setClickedPoints] = useState([]);
    const [intensity, setIntensity] = useState(0);
    const [map, setMap] = useState(null);
    const [heatLayer, setHeatLayer] = useState(null);
    const [lastClickedPoint, setLastClickedPoint] = useState(null);
    const [allClickedPoints, setAllClickedPoints] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const history2 = useHistory();



    useEffect(() => {
        const mapInstance = L.map('heatmap-map').setView([0, 0], 5);
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

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        const newPoint = [lat, lng, intensity];
        // Save the clicked point in allClickedPoints
        setAllClickedPoints([...allClickedPoints, newPoint]);

        // Save the complete history of allClickedPoints
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, [...allClickedPoints, newPoint]]);
        setHistoryIndex(newHistory.length);
    
        setClickedPoints([...clickedPoints, newPoint]);
        setLastClickedPoint({ lat, lng });

    };

    useEffect(() => {
        if (map) {
            map.on('click', handleMapClick);
        }
        return () => {
            if (map) {
                map.off('click', handleMapClick);
            }
        };
    }, [map, intensity, clickedPoints]);

    const handleIntensityChange = (event) => {
        setIntensity(parseFloat(event.target.value));
    };

    const handleHeatpointSubmit = () => {
        if (map && clickedPoints.length > 0) {
            // Create the heat layer
            const heatLayer = L.heatLayer(clickedPoints, { radius: 25 });

            // Add the heat layer to the map
            heatLayer.addTo(map);

            // Save the heat layer in state if needed
            setHeatLayer(heatLayer);

             // Clear the clicked points and last clicked point for the next input
            setClickedPoints([]);
            setLastClickedPoint(null);

        }
    };

    const handleClearPoints = () => {
        // Remove all existing heat layers
        if (map) {
            map.eachLayer((layer) => {
                if (layer instanceof L.HeatLayer) {
                    map.removeLayer(layer);
                }
            });
        }
    
        // Clear the clicked points and last clicked point
        setClickedPoints([]);
        setAllClickedPoints([]);
        setLastClickedPoint(null);
        // Clear undo and redo history
        setHistory([]);
        setHistoryIndex(-1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
          const newHistoryIndex = historyIndex - 1;
          setHistoryIndex(newHistoryIndex);
          const previousPoints = history[newHistoryIndex].slice();
          setClickedPoints(previousPoints);

          // Remove the current heat layer
          map.eachLayer((layer) => {
            if (layer instanceof L.HeatLayer) {
                map.removeLayer(layer);
            }
          });

         // Create a new heat layer with the previous points
          if (previousPoints.length > 0) {
            const newHeatLayer = L.heatLayer(previousPoints, { radius: 25 });
            newHeatLayer.addTo(map);
          }
        }
    };
    
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
          const newHistoryIndex = historyIndex + 1;
          setHistoryIndex(newHistoryIndex);
          const nextPoints = history[newHistoryIndex].slice();
          setClickedPoints(nextPoints);

          // Remove the current heat layer
        map.eachLayer((layer) => {
            if (layer instanceof L.HeatLayer) {
                map.removeLayer(layer);
            }
        });

      // Create a new heat layer with the next points
        if (nextPoints.length > 0) {
            const newHeatLayer = L.heatLayer(nextPoints, { radius: 25 });
            newHeatLayer.addTo(map);
        }
        }
    };

    const renderGeoJSON = (map) => {
        if (map) {// if map variable from stat e exists(load map function excute successfully)
            const thisMap = map;//assgin map variable from state
                try {
                    const geojsonData = store.currentMap.mapObjects;; //Parse the data of GeoJSON file
                    const geojsonLayer = L.geoJSON(geojsonData, { //create geojason layer
                        onEachFeature: function (feature, layer) {
                            // Check if the feature has a 'name' property (replace 'name' with the actual property name containing region names)
                        },
                    }).addTo(thisMap); //adds the geojason layer to the leaft map.
                    // Get the bounds of the GeoJSON layer
                    const geojsonBounds = geojsonLayer.getBounds();

                     // Set the map view to the bounds of the GeoJSON layer
                    thisMap.fitBounds(geojsonBounds);
    
                }
                catch (error) {
                    console.error('Error rendering GeoJSON:', error);
            }
        };
    }

    const handleExit =() =>{
        history2.push('/');
    }

    const handleSave =() =>{
        store.saveHeatArray(store.currentMap._id, allClickedPoints)
        setClickedPoints([]);
        setAllClickedPoints([]);
        setLastClickedPoint(null);
        history2.push('/');
    }
    return (
        <div id="heatmap-edit-container">
            <div id="heatmap-controls">
                <TextField
                    type="number"
                    label="Intensity"
                    value={intensity}
                    onChange={handleIntensityChange}
                />
                <Button onClick={handleHeatpointSubmit}>Add Heat Point</Button>
                <Button onClick={handleClearPoints}>Clear Points</Button>
                <Button onClick={handleUndo} disabled={historyIndex === 0}> Undo </Button>
                <Button onClick={handleRedo} disabled={historyIndex === history.length - 1}> Redo </Button>
                <Button onClick={handleSave} >Save</Button>
                <Button onClick={handleExit}>Exit</Button>
            </div>
            <div id="heatmap-map" style={{ height: '500px' }} />
            {lastClickedPoint && (
                    <p>Last Clicked Point: Lat {lastClickedPoint.lat}, Lng {lastClickedPoint.lng}</p>
                )}
        </div>
    );
};

export default HeatmapEditScreen;

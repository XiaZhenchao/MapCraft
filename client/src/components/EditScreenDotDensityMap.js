import React, { useContext, useState, useEffect } from 'react';
import { GlobalStoreContext } from '../store';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import L from 'leaflet';
import { useHistory } from 'react-router-dom';
import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';

const DotDensityEditScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const [intensity, setIntensity] = useState(0);
  const [map, setMap] = useState(null);
  const [densityOption, setDensityOption] = useState('Population'); // Default option
  const [allDotPoints, setAllDotPoints] = useState([]);
  const history2 = useHistory();
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dotColor, setDotColor] = useState('black');
  const [population, setPopulation] = useState(0);
  const [gdp, setGDP] = useState(0);
  const [dotCounts, setDotCounts] = useState(0);

  useEffect(() => {
    const mapInstance = L.map('heatmap-map').setView([0, 0], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
    }).addTo(mapInstance);

    setMap(mapInstance);
    renderGeoJSON(mapInstance);

    // Check if there are existing points in store.currentMap.dotArray
    if (store.currentMap.dotDensityArray && store.currentMap.dotDensityArray.length > 0) {
        const markers = store.currentMap.dotDensityArray[0].dotArray.map(point => L.circleMarker(point, { radius: 0.1, color: store.currentMap.dotDensityArray[0].color }));
        const markerLayer = L.layerGroup(markers);
        mapInstance.addLayer(markerLayer);
    }
        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
        };
    }, allDotPoints.length);


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

    const handleColorChange = (event) => {
        setDotColor(event.target.value);
    };


    const handleGenerate = () => {
        if (!map) return; // Ensure map is available
    
        let markerArray = [];
  
        map.eachLayer((layer) => {
            if (layer instanceof L.CircleMarker) {
                map.removeLayer(layer); // Remove existing markers
            }
        })

    
        store.currentMap.mapObjects.features.forEach((feature) => {
            let densityValue;
            if (densityOption === 'Population'){
                densityValue = feature.properties.pop_est;
                console.log("----");
                setPopulation(densityValue);
                setGDP(gdp);
            } else {
                densityValue = feature.properties.gdp_md;
                console.log("----111");
                setPopulation(population);
                setGDP(densityValue);
            }
        
        const dotsCount = Math.round(densityValue / intensity);
        console.log("ppopulation:",densityValue);
        console.log(dotsCount);
        const bounds = L.geoJSON(feature).getBounds();
    
        //to create an array of random points.
        const randomPoints = Array.from({ length: dotsCount }, () => generateRandomPoint(bounds));
        console.log("ramdom:",randomPoints);
        markerArray = [...markerArray, ...randomPoints];
        setAllDotPoints(markerArray);
        console.log("makerArray: ",markerArray);

        // Create a layer group with all markers
        const markers = L.layerGroup(randomPoints.map(point => L.circleMarker(point, { radius: 0.5, color: dotColor })
                                                                .bindPopup('Region: '+ feature.properties.name_en +  '<br>' +  
                                                                (densityOption === 'Population'? "Population: " + feature.properties.pop_est
                                                                : "GDP: " + feature.properties.gdp_md))));

        // Add the layer group to the map
        markers.addTo(map);
        });
         // Save the complete history of allClickedPoints
         const updatedHistory = [...history, markerArray];
         console.log("update: ", updatedHistory );
         setHistory(updatedHistory);
         setHistoryIndex(updatedHistory.length);
         //setAllDotPoints(markerArray.flat());
         setDotCounts(allDotPoints.length);
    }

     //genrate random points in the bounds
     const generateRandomPoint = (bounds) => {
        const randomLat = bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth());
        const randomLng = bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest());
      
        return [randomLat, randomLng];
    };

    const handleSave =() =>{
        setDotColor(dotColor);
        console.log("1:",allDotPoints);
        console.log(dotColor);
        console.log(population);
        console.log(gdp);
        console.log("5:",dotCounts);
        store.saveDotArray(store.currentMap._id, allDotPoints, population, gdp,dotColor, dotCounts, intensity);
        setAllDotPoints([]);
        history2.push('/');
    }

    const handleExit =() =>{
        history2.push('/');
    }

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
        setHistory([]);
        setHistoryIndex(-1);
        // Clear undo and redo history
    };


    const handleUndo = () => {
        console.log('history index: ', historyIndex);
        if (historyIndex > 0) {
          const newHistoryIndex = historyIndex - 1;
          setHistoryIndex(newHistoryIndex);
          console.log(history);
    
          // Update the map based on the points from history
          const previousPoints = history[newHistoryIndex];
          console.log("previous: ", previousPoints);
          updateMapWithPoints(previousPoints);
        }
      };
    
      const handleRedo = () => {
        if (historyIndex < history.length - 1) {
          const newHistoryIndex = historyIndex + 1;
          setHistoryIndex(newHistoryIndex);
    
          // Update the map based on the points from history
          const nextPoints = history[newHistoryIndex];
          updateMapWithPoints(nextPoints);
        }
      };
    
      const updateMapWithPoints = (points) => {
        // Remove the current markers
        map.eachLayer((layer) => {
          if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
          }
        });
    
        // Add new markers based on the points from history
        const newDotDensityLayer = L.layerGroup(points.map(point => L.circleMarker(point, { radius: 0.5, color: dotColor })));
        newDotDensityLayer.addTo(map);
      };


    


  return (
    <div id="dotdensity-edit-container">
      <div id="dotdenisty-controls">
        <TextField
          label="Intensity"
          type="number"
          value={intensity}
          onChange={handleIntensityChange}
          style={{ margin: '8px' }}
        />
        <TextField
          select
          label="Density Option"
          value={densityOption}
          onChange={handleDensityOptionChange}
          style={{ margin: '8px', marginRight: '20px' }}
        >
          <MenuItem value="Population">Population</MenuItem>
          <MenuItem value="GDP">GDP</MenuItem>
        </TextField>

        Color: 
        <input
              type="color"
              value={dotColor}
              onChange={handleColorChange}
              style={{ width: '50px', height: '30px', borderRadius: '10%', cursor: 'pointer', marginLeft: '10px', margin: '8px' }}
        />

        <Button onClick={handleGenerate} style={{ margin: '8px' }}> Generate </Button>
        <Button onClick={handleClearPoints} style={{ margin: '8px' }}>Clear Points</Button>
        <Button onClick={handleSave} style={{ margin: '8px' }}>Save</Button>
        <Button onClick={handleExit} style={{ margin: '8px' }}>Exit</Button>
      </div>
      <div id="heatmap-map" style={{ height: '500px' }} />
      <p>
        {store.currentMap.dotDensityArray.length > 0
        ? densityOption === 'Population'
          ? `1 point = ${store.currentMap.dotDensityArray[0].intensity} Population`
          : `1 point = ${store.currentMap.dotDensityArray[0].intensity} GDP`
        : densityOption === 'Population'
        ? `1 point = ${intensity} Population`
        : `1 point = ${intensity} GDP`
        }
  </p>
    </div>
  );
};

export default DotDensityEditScreen; 
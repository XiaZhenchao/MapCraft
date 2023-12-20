import React, { useState, useEffect, useContext } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useHistory } from 'react-router-dom';
import { GlobalStoreContext } from '../store';
import { MenuItem } from '@mui/material';

const ChoroplethEditScreen = () => {
  const [map, setMap] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionProperties, setRegionProperties] = useState({});
  const [densityOption, setDensityOption] = useState('Population'); // Default option
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
  

  useEffect(() => {
    if (map) {
      const geojsonData = store.currentMap.mapObjects;

      //const colorScale = chroma.scale(['#fafa6e', '#2A4858']).domain([0, 1000000000]); // Adjust colors and domain as needed

      const geojsonLayer = L.geoJSON(geojsonData, {
        style: (feature) => {
          let data;
          if (densityOption === 'Population'){
            data = feature.properties.pop_est || 0; // Adjust property name based on your GeoJSON structure
          } else {
            data = feature.properties.gdp_md || 0;
          }
          return {
            fillColor: getColor(data),
            color: 'blue',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          };
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (event) => {
              const hoveredLayer = event.target;
              hoveredLayer.setStyle({
                weight: 3,
                color: 'black',
                fillOpacity: 1,
              });

              if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                hoveredLayer.bringToFront();
              }
            },
            mouseout: (event) => {
              const hoveredLayer = event.target;
              hoveredLayer.setStyle({
                weight: 1,
                color: 'blue',
                fillOpacity: 0.8,
              });
            },
            click: (event) => {
              const clickedFeature = event.target.feature.properties;
              //handleRegionClick(clickedFeature);
            },
          });

          layer.bindPopup((layer) => {
            const properties = layer.feature.properties;
            if (densityOption === 'Population'){
              return `Region: ${properties.name_en}<br>Population: ${properties.pop_est}`; // Adjust accordingly
            }
            if (densityOption === 'GDP'){
              return `Region: ${properties.name_en}<br>GDP: ${properties.gdp_md}`; // Adjust accordingly
            }
          });
        },
      }).addTo(map);

      const geojsonBounds = geojsonLayer.getBounds();
      map.fitBounds(geojsonBounds);
    }
  }, [map, store.currentMap.mapObjects, densityOption]);

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
          style: (feature) => {
            const population = feature.properties.pop_est || 0; // Adjust property name based on your GeoJSON structure
            return {
              fillColor: getColor(population),
              color: 'blue',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8,
            };
          },
          onEachFeature: function (feature, layer) {
            // Bind a popup with information to each feature
            layer.bindPopup('Region: ' + feature.properties.regionName);
            // Add click event
            layer.on('click', function () {
              alert('You clicked on ' + feature.properties.regionName);
              // You can perform additional actions here
            });
          
            layer.on('mouseover', function () {
              layer.setStyle({
                weight: 3,
                color: 'black',
                fillOpacity: 1,
              });
            });
  
            // Reset styles on mouseout
            layer.on('mouseout', function () {
              geojsonLayer.resetStyle(layer);
            });
          },
        }).addTo(map);
        
        // Get the bounds of the GeoJSON layer
        const geojsonBounds = geojsonLayer.getBounds();
  
        // Set the map view to the bounds of the GeoJSON layer
        thisMap.fitBounds(geojsonBounds);
      } catch (error) {
        console.error('Error rendering GeoJSON:', error);
      }
    }
  };
  
  function getValueForFeature(feature) {
    // Replace this with the logic to retrieve the value for each feature
    // For example, you might get the value from feature.properties or another source
    return feature.properties.value || 0;
  }
  
  function getColor(d) {
    return d > 10000000
      ? 'red'
      : d > 1000000
      ? 'blue'
      : d > 100000
      ? '#E31A1C'
      : d > 10000
      ? '#FC4E2A'
      : d > 1000
      ? '#FD8D3C'
      : d > 100
      ? '#FEB24C'
      : d > 10
      ? '#FED976'
      : '#FFEDA0';
  }
  
    const handleRegionClick = (event, feature) => {
      setSelectedRegion(feature.id);
      setRegionProperties(feature.properties);
      // Other logic for handling the click
      console.log('Clicked on region:', feature);
    };

  const handleExit = () => {
    history.push('/');
  };

  var legend = L.control({position: 'bottomright'});

  if(map){
    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 10, 100, 1000, 10000, 100000, 1000000, 100000000],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(map);
  }

  const handleDensityOptionChange = (event) => {
    console.log(event.target.value);
    setDensityOption(event.target.value);
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
        <TextField
          select
          label="Density Option"
          value={densityOption}
          onChange={handleDensityOptionChange}
        >
          <MenuItem value="Population">Population</MenuItem>
          <MenuItem value="GDP">GDP</MenuItem>
        </TextField>
        <Button onClick={handleExit}>Exit</Button>
      </div>
      <div id="choropleth-map" style={{ height: '500px' }} />
    </div>
  );
};

export default ChoroplethEditScreen;
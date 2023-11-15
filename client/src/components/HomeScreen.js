import React, { useEffect, useState } from 'react';
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import LockIcon from '@mui/icons-material/Lock';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import shp from 'shpjs';

const HomeScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [map, setMap] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // Load the map when the component mounts
    loadMap();
  }, []); // The empty dependency array ensures it runs once on mount

  const loadMap = () => {
    try {
      const mapInstance = L.map('container').setView([0, 0], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href=" ">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);
      setMap(mapInstance);
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };

  const handleEditButton = () => {
    history.push('/edit/');
  };

  const handleSelectFileButton = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip,.shp,.json,.kml';
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      setSelectedFile(file);
      console.log('Selected File:', file);
    });
    fileInput.click();
  };

  const handleRenderButtonClick = () => {
    console.log('handleRenderButtonClick');
    renderShpFile();
  };

  const renderShpFile = () => {
    console.log('renderShpFile');
    const reader = new FileReader();
    console.log('selectedFile: ', selectedFile);
    console.log('map: ', map);
    if (map && selectedFile) {
      console.log('map && selectedFile');
      const mapInstance = map;
      reader.onload = async (e) => {
        try {
          const shpData = await shp.read(e.target.result);
          const features = [];
          while (true) {
            const { done, value } = await shpData.read();
            if (done) break;
            features.push(value);
          }
          const geojsonData = {
            type: 'FeatureCollection',
            features: features,
          };
          const geojsonLayer = L.geoJSON(geojsonData).addTo(mapInstance);
          mapInstance.fitBounds(geojsonLayer.getBounds());
        } catch (error) {
          console.error('Error rendering Shapefile:', error);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, background: 'lightgray', alignItems: 'center', paddingLeft: '30px' }} id="navigation-bar">
        <IconButton> <AddCircleIcon></AddCircleIcon></IconButton>
        <IconButton> <PublishedWithChangesIcon></PublishedWithChangesIcon></IconButton>
        <IconButton> <LockIcon></LockIcon></IconButton>
        <IconButton> <SortIcon></SortIcon></IconButton>
      </Box>
      <List sx={{ bgcolor: '#ABC8B2', mb: '20px' }} id="list">
        {/* List items go here */}
      </List>
      <div id="map-name">Map1 <IconButton><EditIcon></EditIcon></IconButton></div>
      <Box id="export-close"><ExitToAppIcon></ExitToAppIcon><CloseIcon></CloseIcon></Box>
      <div id="container"></div>
      <div id="function-bar">
        <Button className='button'
          sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem', fontSize: '0.5rem' }}
          id="Select-File-Button"
          onClick={handleSelectFileButton}>select File</Button>
        <Button className='button'
          sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem', fontSize: '0.5rem' }}>Fork</Button>
        <Button className='button'
          sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem', fontSize: '0.5rem' }}
          onClick={handleEditButton}>Edit</Button>
        <Button className='button'
          sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem', fontSize: '0.5rem' }}
          onClick={handleRenderButtonClick}>Render</Button>
        <Button className='button'
          sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem', fontSize: '0.5rem' }}>Publish</Button>
        <Button className='button'
          sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem', fontSize: '0.5rem' }}>Delete</Button>
      </div>
    </div>
  );
};

export default HomeScreen;

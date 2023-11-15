import React, { useContext, useEffect , useState} from 'react'

import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import { IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';




const EditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    let appBanner = <AppBanner />
    const [map, setMap] = useState(null);


    useEffect(() => {
        // Load the map when the component mounts
        loadMap();
      }, []); // The empty dependency array ensures it runs once on mount
    
      const loadMap = () => {
        try {
          const mapInstance = L.map('edit-container').setView([0, 0], 5);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
          }).addTo(mapInstance);
          setMap(mapInstance);
        } catch (error) {
          console.error('Error loading map:', error);
        }
      };

      
    
    

    
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
          <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '20px', margin: '1.0rem'}} id = "edit-bar" >
              <IconButton> <TextFieldsIcon></TextFieldsIcon></IconButton>
              <IconButton> <LocationOnIcon></LocationOnIcon></IconButton>
              <IconButton sx={{margin: '1.0rem'}}><Button id = "line-box"></Button></IconButton>
              <IconButton sx={{margin: '0.3rem'}}><Button id = "color-box"></Button></IconButton>
              <IconButton sx={{ fontSize: '2rem', color: 'black'}}>⟳</IconButton>
              <IconButton sx={{ fontSize: '2rem', color: 'black'}}>⟲</IconButton>
              <IconButton> <SaveIcon></SaveIcon></IconButton>
              <IconButton> <DeleteIcon></DeleteIcon></IconButton>
          </Box>
          <div id = "map-name-another">Map1 <IconButton><EditIcon></EditIcon></IconButton></div>
        <Box  id = "export-close"><ExitToAppIcon></ExitToAppIcon><CloseIcon></CloseIcon></Box>
      <div id = "edit-container"></div>
        
      </div>)
}


export default EditScreen;
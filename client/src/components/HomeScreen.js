import React, { useContext, useState, useEffect } from 'react'
//import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js';
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
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/*
   This React component lists all the top5 lists in the UI.
  
   @author McKilla Gorilla
*/
const HomeScreen = () => {
   //const { store } = useContext(GlobalStoreContext);
   let appBanner = <AppBanner />

   const [selectedFile, setSelectedFile] = useState(null);
  const [map, setMap] = useState(null);
  const history = useHistory();
  const [isBorderVisible, setIsBorderVisible] = useState(false);
  useEffect(() => {
    // Load the map when the component mounts
    loadMap();
  }, []); // The empty dependency array ensures it runs once on mount

  const loadMap = () => {
    try {
      const mapInstance = L.map('container').setView([0, 0], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
      }).addTo(mapInstance);
      setMap(mapInstance);
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };
   const handleEditButton = () => {
       history.push("/edit/");
   }
   const handleAdd =()=>{

   }
   const handlePublic =()=>{
        setIsBorderVisible(!isBorderVisible);
   }
   const handlePrivate=()=>{
        setIsBorderVisible(!isBorderVisible);
   }
  
   return (
       <div >
        <div style={{ display: 'flex', flexDirection: 'column',maxHeight:'630px'}}>
       <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '30px'}} id = "navigation-bar" >
           <IconButton style = {{color:'black'}}> <AddCircleIcon onClick={handleAdd} style={{fontSize: '2rem'}}></AddCircleIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <PublishedWithChangesIcon onClick={handlePublic} style={{ fontSize: '2rem',border: isBorderVisible ? '2px solid black' : 'none' }}></PublishedWithChangesIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <LockIcon onClick={handlePrivate} style={{ fontSize: '2rem',border: !isBorderVisible ? '2px solid black' : 'none' }}></LockIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <SortIcon style={{fontSize: '2rem'}}></SortIcon></IconButton>
       </Box>
       <List sx={{ bgcolor: '#ABC8B2', mb:"20px" ,
            overflow: 'auto'}}id = "list" >
           {
           <MapList  style ={{ borderColor:'#e1ed05'} } >111</MapList>               
           }
           <Box id = "map-info"><div>created at</div><div>Map name: Map1</div></Box>
           <Box id = "map-info"><div>2023/11/14</div><div>by Jeff</div></Box>

           <div className="underscore"></div>
           {
           <MapList></MapList>
           }
           <Box id = "map-info"><div>created at</div><div>Map name: Map2</div></Box>
           <Box id = "map-info"><div>2023/11/14</div><div>by Jeff</div></Box>
           <div className="underscore"></div>
           {
           <MapList></MapList>               
           }
           <Box id = "map-info"><div>created at</div><div>Map name: Map3</div></Box>
           <Box id = "map-info"><div>2023/11/14</div><div>by Jeff</div></Box>
           <div className="underscore"></div>
           {
           <MapList></MapList>               
           }
           <Box id = "map-info"><div>created at</div><div>Map name: Map4</div></Box>
           <Box id = "map-info"><div>2023/11/14</div><div>by Jeff</div></Box>
           <div className="underscore"></div>
       </List>
       </div>
       <div id = "map-name" style={{fontSize: '2rem'}}>Map1 <IconButton ><EditIcon style={{fontSize: '2rem'}}></EditIcon></IconButton>
       </div>
       <Box  id = "export-close"><ExitToAppIcon style={{fontSize: '2rem'}}></ExitToAppIcon><CloseIcon style={{fontSize: '2rem'}}></CloseIcon></Box>
       <List id = "Mapview" >
       <div id = "container" class="element-with-stroke">
      
       </div>
      
       <div id = "function-bar" class="element-with-stroke">
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>select File</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Fork</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   onClick={handleEditButton}>Edit</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Render</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Publish</Button>
           <Button className='button' 
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Delete</Button>
       </div></List>
       </div>)
}


export default HomeScreen;


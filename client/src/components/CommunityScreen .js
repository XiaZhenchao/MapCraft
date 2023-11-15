import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js';
import LockIcon from '@mui/icons-material/Lock';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FaceIcon from '@mui/icons-material/Face';
import Face4Icon from '@mui/icons-material/Face4';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const CommunityScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    let appBanner = <AppBanner />

    const [isExpanded, setIsExpanded] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [map, setMap] = useState(null);
    const history = useHistory();

  useEffect(() => {
    // Load the map when the component mounts
    loadMap();
  }, []); // The empty dependency array ensures it runs once on mount

  const loadMap = () => {
    try {
      const mapInstance = L.map('community-container').setView([0, 0], 5);
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

   const handleSort = () => {
    setIsExpanded(!isExpanded);
   }
   const handleselect = (value) => {
    setButtonText(value)
    setIsExpanded(!isExpanded);
   }

  
   return (
       <div >
        <div style={{ display: 'flex', flexDirection: 'column',maxHeight:'630px'}}>
       <Box sx={{ background: 'lightgray', alignItems: 'center',padding:'0%'}} id = "navigation-bar" >
           <IconButton onClick = {handleSort} style = {{color:'black'}}> <SortIcon style={{fontSize: '2rem'}}></SortIcon><div style={{paddingLeft:'60px'}}>{buttonText}</div></IconButton>
           {isExpanded && (
        <div>
          <Button id='sort-selection' onClick={() => handleselect('Date (asc)')} >Date (asc)</Button>
          <Button id='sort-selection' onClick={() => handleselect('Date (desc)')} >Date (desc)</Button>
          <Button id='sort-selection' onClick={() => handleselect('Likes')} >Likes</Button>
          <Button id='sort-selection' onClick={() => handleselect('Dislikes')} >Dislikes</Button>
        </div>
        
      )}
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
       <div id = "big-container" class="element-with-stroke">
       <div id = "community-container"></div>
       <div id = "report"><Box sx={{  alignItems: 'center'}}>Report<Button id = "report-box" ></Button></Box></div>
        
       <div id = "comment">
            <div>&nbsp;&nbsp;<Face4Icon></Face4Icon> Add Comment...</div>
            <span>___________________________________________________________________________</span>
            <div>&nbsp;&nbsp;<FaceIcon></FaceIcon>@Jack 6 months ago</div>&nbsp;&nbsp;
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is a really great idea!</div>
            <div>
            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<IconButton><ThumbUpIcon style={{fontSize: '1rem'}}></ThumbUpIcon></IconButton>
             <IconButton><ThumbDownIcon style={{fontSize: '1rem'}}></ThumbDownIcon></IconButton>
                <Button id = "report-box"></Button>
            </div>
        </div>
        </div>
        </List>
       </div>)
}

export default CommunityScreen;
import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js';
import LockIcon from '@mui/icons-material/Lock';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';
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


  
   return (
       <div >
       <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '30px'}} id = "navigation-bar" >
           <IconButton style = {{color:'black'}}> <SortIcon style={{fontSize: '2rem'}}></SortIcon></IconButton>
       </Box>
       <List sx={{ bgcolor: '#ABC8B2', mb:"20px" }}id = "list" >
           {
           <MapList  style ={{ borderColor:'#e1ed05'} } >111</MapList>               
           }
           created at   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Map name: Map1
           2023/11/14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Jeff
           <div className="underscore"></div>
           {
           <MapList>"11111"</MapList>
           }
           created at   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Map name: Map2
           2023/11/14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Jeff
           <div className="underscore"></div>
           {
           <MapList>"1111"</MapList>               
           }
           created at   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Map name: Map3
           2023/11/14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Jeff
           <div className="underscore"></div>
           {
           <MapList>"1111"</MapList>               
           }
           created at   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    Map name: Map4
           2023/11/14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; by Jeff
           <div className="underscore"></div>
       </List>
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
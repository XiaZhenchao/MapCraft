import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js';
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
import CommentCard from './CommentCard.js';
import TextField from '@mui/material/TextField';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const CommunityScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [current, setcurrent] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false);
    const [buttonText, setButtonText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [map, setMap] = useState(null);
    const history = useHistory();

  useEffect(() => {
    // Load the map when the component mounts
    loadMap();
  }, []); // The empty dependency array ensures it runs once on mount

  useEffect(() => {
    if (store.currentMap != null) {
        if (current == null){
            setcurrent(store.currentMap)
            loadMap();
        }
        else{
            if (current!=store.currentMap){
               
                map.remove(); 
                setMap(null);
            }
            loadMap();
        }
    }
  }, [store.currentMap]);

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

   const handleCommentInput = (event) =>{
    if(event.keyCode == 13){
        let temp = event.target.value
        store.setComment(store.currentMap._id,temp,auth.user.firstName+" "+auth.user.lastName)
    }
   }

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

   const handleCloseButton =() =>{
    store.closeCurrentMap();
    setcurrent(null);
    map.remove(); 
    setMap(null);
    
}

   let listCard = "";
   if (store) {
       listCard = 
       <div>
           {
               store.idNamePairs.filter((pair) => (pair.authorName == auth.user.firstName+" "+auth.user.lastName)).map((pair) => (
                   <MapList
                       key={pair._id}
                       idNamePair={pair}
                       publish = {pair.publishStatus}
                       publishDate = {pair.publishDate}
                       likes = {pair.likes}
                       disLikes = {pair.disLikes}
                   />
               ))
           }
       
       </div>

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
       <List sx={{ bgcolor: '#ABC8B2', mb:"20px",
            overflow: 'scroll'}}>  
            {listCard}
        </List>
       </div>
       <div id = "map-name" style={{fontSize: '2rem'}}>
          {store.currentMap != null? store.currentmapName: "" }       
       </div>
       <Box  id = "export-close">
        <IconButton>
            <ExitToAppIcon style={{fontSize: '1.5rem'}}></ExitToAppIcon>
        </IconButton>
        <IconButton onClick={handleCloseButton}><CloseIcon style={{fontSize: '1.5rem'}}>
        </CloseIcon>
        </IconButton>
        </Box>
       
        <List id = "Mapview" >
        {store.currentMap == null? (
       <div id = "container" class="element-with-stroke">
        No Map selected, please select a map or click on  to start a new map editor.
       </div> ):<div id = "big-container" class="element-with-stroke">
       <div id = "community-container"></div>
       
       <div id = "report"><Box sx={{  alignItems: 'center'}}>Report<Button id = "report-box" ></Button></Box></div>
       <div>
       <div>
       <div>
    <Box>
        <TextField
            id="filled-basic"
            label="Add Comment"
            variant="filled"
            style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: '15px',
                marginTop: '2%',
                padding: '1%',
            }}
            onKeyDown={handleCommentInput}
        />
    </Box>
    <div id="CommentCards" style={{ overflow: 'scroll', backgroundColor: '#6495ED', marginTop: '2%', height: '60vh' }}>
        <Box style={{ fontSize: '20px', marginTop: '3%', marginLeft: '2%', width: '60%' }}>
            {store.currentMap && store.currentMap.commentObj && store.currentMap.commentObj.length > 0 ? (
                store.currentMap.commentObj.map((commentObj, index) => (
                    <CommentCard
                        key={index}
                        username={commentObj.username}
                        comment={commentObj.comment}
                    />
                ))
            ) : (
                <p>No comments available</p>
            )}
        </Box>
         <p>No comments available</p>
    </div>
</div>
</div>
               </div>
               
        </div>
        }
        </List>
       </div>)
}

export default CommunityScreen;
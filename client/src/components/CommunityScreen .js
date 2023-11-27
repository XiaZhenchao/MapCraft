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
import PersonOffIcon from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CommentCard from './CommentCard.js';

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

   const handleBanUserButton = () =>{
    const ownerEmail=store.currentMap.ownerEmail;
    auth.banUserByEmail(ownerEmail);
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
               store.idNamePairs.filter((pair) => pair.publishStatus === true).map((pair) => (
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
       <div style={{ width: '29%', overflow: 'scroll' }}>
        <List sx={{ bgcolor: '#ABC8B2', mb:"20px"}}>  
            {listCard}
        </List>
       </div>
       
       </div>
       <div id = "map-name" style={{fontSize: '2rem'}}>
          {store.currentMap != null? store.currentmapName: "" }       
       </div>
       <Box  id = "export-close">
       {auth.user.role === "admin" && <IconButton onClick={handleBanUserButton}>
                        <PersonOffIcon style={{ fontSize: '1.5rem', color: 'red' }} />

                    </IconButton>
        }
        <IconButton>
            <ExitToAppIcon style={{fontSize: '1.5rem'}}></ExitToAppIcon>
        </IconButton>
        <IconButton onClick={handleCloseButton}><CloseIcon style={{fontSize: '1.5rem'}}>
        </CloseIcon>
        </IconButton>
        </Box>
       
        <Box id = "Mapview" style={{ maxHeight: '800px', maxWidth: '780px', overflowY: 'auto' }} >
        {store.currentMap == null? (
       <div id = "container_another" class="element-with-stroke">
        No Map selected, please select a map or click on  to start a new map editor.
       </div> ):<div id = "big-container" class="element-with-stroke">
       <div id = "community-container"></div>
        </div>
       }

        <div id="CommentCards">
        <Box>
            <br></br>
            <div><Box> {auth.user.firstName + " " + auth.user.lastName} :</Box>
            <TextField
            id="filled-basic"
            label="Add Comment"
            variant="filled"
            style={{
                width: '98%',
                backgroundColor: 'transparent',
                borderRadius: '15px',
                marginTop: '0%',
                padding: '1%',
            }}
            onKeyDown={handleCommentInput}
        /></div>
        
    </Box>

            <Box style={{ fontSize: '20px', marginTop: '3%', marginLeft: '2%', width: '40%' }}>
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


       </Box>
    </div>)
}

export default CommunityScreen;
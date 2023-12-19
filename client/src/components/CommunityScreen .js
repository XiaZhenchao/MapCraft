import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import { IconButton } from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import TextField from '@mui/material/TextField';
import CommentCard from './CommentCard.js';
import MUIBanUserSuccessModal from './MUIBanUserSuccessModal.js';

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
    const [banUserSuccessModal, setBanUserSuccessModal] = useState(false);
    const history = useHistory();
    const [heatLayer, setHeatLayer] = useState(null);


  useEffect(() => {
    // Load the map when the component mounts
    loadMap();
    store.loadCommentPairs();
    //console.log(store.commentIdNamePairs);
    
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
            const mapInstance = L.map('big-container').setView([0, 0], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
            }).addTo(mapInstance);

            setMap(mapInstance);
            renderGeoJSON(mapInstance)

            //HeatMap Cases
            if (store.currentMap.mapTemplate=="heatMap"){
                // Check if there are existing points in store.currentMap.heatArray
                if (store.currentMap.heatArray && store.currentMap.heatArray.length > 0) {
                // Create the heat layer with existing points
                const existingHeatLayer = L.heatLayer(store.currentMap.heatArray, { radius: 25 });
        
                // Add the heat layer to the map
                existingHeatLayer.addTo(mapInstance);
        
                // Save the heat layer in state if needed
                setHeatLayer(existingHeatLayer);
                }
            }

            if (store.currentMap.mapTemplate=="dotDensityMap"){
                console.log("I am here");
                console.log(store.currentMap.dotDensityArray);
                
                if (store.currentMap.dotDensityArray && store.currentMap.dotDensityArray.length > 0) {
                    const markers = store.currentMap.dotDensityArray[0].dotArray.map(point => L.circleMarker(point, { radius: 0.1, color: store.currentMap.dotDensityArray[0].color }));
                    const markerLayer = L.layerGroup(markers);
                    mapInstance.addLayer(markerLayer);
                }
            }
            
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };
    const renderGeoJSON = (mapInstance) => {
        if (mapInstance) {// if map variable from stat e exists(load map function excute successfully)
            const thisMap = mapInstance;//assgin map variable from state
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

   const handleCommentInput = (event) =>{
    if(event.keyCode == 13){
        let temp = event.target.value
        store.setComment(temp,auth.user.firstName+" "+auth.user.lastName)
    }
   }


   const handleEditButton = () => {
       history.push("/edit/");
   }

   const handleSort = () => {
    setIsExpanded(!isExpanded);
   }
   const handleselectasc = (value) => {
    setButtonText(value)
    setIsExpanded(!isExpanded);
    store.sortCreationDatesAsc();
   }

   const handleselectdesc = (value) => {
    setButtonText(value)
    setIsExpanded(!isExpanded);
    store.sortCreationDatesDesc();
   }

   const handleselectlikes = (value) => {
    setButtonText(value)
    setIsExpanded(!isExpanded);
    store.sortLikes();
   }

   const handleselectdisLikes = (value) => {
    setButtonText(value)
    setIsExpanded(!isExpanded);
    store.sortDisLikes();
   }

   const handleBanUserButton = () =>{
    const ownerEmail=store.currentMap.ownerEmail;
    auth.banUserByEmail(ownerEmail);
    setBanUserSuccessModal(true);
   }

   const handleCloseButton =() =>{
    store.closeCurrentMap();
    setcurrent(null);
    map.remove(); 
    setMap(null);
    
}
function handleForkButton(){
    store.forkMap(store.currentMap._id)   
    history.push("/") 
}

const handleExportButton = () =>{
    if (map) { // Assuming 'map' is set in your state and properly updated via 'setMap'
        // Create the easyPrint control and add it to the map instance
        var printer = L.easyPrint({
            filename: 'myMap',
            exportOnly: true,
            hideControlContainer: true,
            hidden: true,
        }).addTo(map);

        // Trigger the printing action
        printer.printMap('CurrentSize', 'MyManualPrint');
    } else {
        console.error('Map instance not found.'); // Log an error if the map instance is missing
    }

};


    let listCard = "";
    if (store ) {
        if (store.searchText === "")
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
        else {
            listCard = 
            <div>
                {
                    store.idNamePairs.filter((pair) => pair.publishStatus === true && 
                    pair.name.toLowerCase().includes(store.searchText)).map((pair) => (
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

    }

    console.log("comment pairs-------");
    // store.commentIdNamePairs.forEach(item => {
    //     console.log(item);
    //    });


    let commentCard = "";
    if (store.currentMap) {
        commentCard = 
        <div>
            {
                commentCard = store.commentIdNamePairs.filter((pair) => pair.mapId === store.currentMap._id).map((Pair) =>
                    <CommentCard
                        key={Pair._id}
                        idNamePair={Pair}
                        likes = {Pair.likes}
                        disLikes = {Pair.disLikes}
                        comment = {Pair.comment}
                    />
                )
            }
        
        </div>

    }

  
   return (
       <div id = 'app-root'>
        <div style={{ display: 'flex', flexDirection: 'column',height: '100%', maxHeight:'600px'}}>
       <Box sx={{ background: 'lightgray', alignItems: 'center',padding:'0%'}} id = "navigation-bar" >
           <IconButton onClick = {handleSort} style = {{color:'black'}}> <SortIcon style={{fontSize: '2rem'}}></SortIcon><div style={{paddingLeft:'60px'}}>{buttonText}</div></IconButton>
           {isExpanded && (
        <div>
          <Button id='sort-selection' onClick={() => handleselectasc('Date (asc)')} >Date (asc)</Button>
          <Button id='sort-selection' onClick={() => handleselectdesc('Date (desc)')} >Date (desc)</Button>
          <Button id='sort-selection' onClick={() => handleselectlikes('Likes')} >Likes</Button>
          <Button id='sort-selection' onClick={() => handleselectdisLikes('Dislikes')} >Dislikes</Button>
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
       <Box  id = "export-close-community">
       {auth.user!=null?(auth.user.role === "admin" && <IconButton onClick={handleBanUserButton}>
                        <PersonOffIcon style={{ fontSize: '1.5rem', color: 'red'}} />

                    </IconButton>):null
        }  
        <Tooltip title="Export" arrow>
            <IconButton onClick={handleExportButton}>
            <ExitToAppIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
       </Tooltip>
       <Tooltip title="Close" arrow>
            <IconButton onClick={handleCloseButton}>
            <CloseIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
       </Tooltip>
        </Box>
       
        <Box id = "Mapview" style={{ maxHeight: '800px', maxWidth: '780px', overflowY: 'auto' }} >
        {store.currentMap == null? (
       <div id = "container_another" class="element-with-stroke">
        No Map selected, please select a map or click on  to start a new map editor.
       </div> ):<div id = "big-container" class="element-with-stroke">
       <div id = "community-container"></div>
        </div>
       }

            <div id = "function-bar" class="element-with-stroke">
                <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={store.currentMap == null}
                   onClick={handleForkButton}>Fork</Button>  
            </div>

    {store.currentMap != null? ( 
        

    <div id="CommentCards">
        {auth.user!=null?(
    <Box>
        <br></br>
        <div><Box style={{ marginLeft: '10px' }}> {auth.user.firstName + " " + auth.user.lastName} :</Box>
        <TextField
        id="filled-basic"
        label="Add Comment"
        variant="filled"
        style={{
            width: '100%',
            backgroundColor: 'transparent',
            borderRadius: '15px',
            marginTop: '0%',
        }}
        onKeyDown={handleCommentInput}
    /></div>
    </Box>):null}

        <Box style={{ fontSize: '20px', marginTop: '3%', marginLeft: '2%', width: '40%' }}>
        {store.currentMap ? 
            <p>{commentCard}</p > :
            <p>No current map available</p >
        }
        </Box>
    </div> ): " "}


    </Box>
       <MUIBanUserSuccessModal open={banUserSuccessModal} handleClose={setBanUserSuccessModal} />
    </div>)
}

export default CommunityScreen;
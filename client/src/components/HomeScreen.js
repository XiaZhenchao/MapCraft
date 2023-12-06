import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js'
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
import MUIDeleteModal from './MUIDeleteModal.js';
import TextField from '@mui/material/TextField';
import toGeoJSON from 'togeojson';
import * as shapefile from 'shapefile';
import MUIBanUserLoginModal from './MUIBanUserLoginModal.js';
import MapTemplateModal from './MapTemplateModal.js';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


/*
   This React component lists all the top5 lists in the UI.
  
   @author McKilla Gorilla
*/
const HomeScreen = () => {
   const { store } = useContext(GlobalStoreContext);
   const { auth } = useContext(AuthContext);
   const [selectedFile, setSelectedFile] = useState(null);
   const [mapType, setMapType] = useState('');
   const [map, setMap] = useState(null);
   const history = useHistory();
   const [isBorderVisible, setIsBorderVisible] = useState(false);
   const [publicList, setPublicList]=useState(false);
   const [fileExtension, setFileExtension] = useState(null);
   const [rendering, setRendering] = useState(false);
   const [editActive, setEditActive] = useState(false);
   const [text, setText] = useState("");
   const [open, setOpen] = useState(false);
    const [current, setcurrent] = useState(null)
    const [openBanUserLoginModal, setOpenBanUserLoginModal] = useState(false);
    const [MapTemplateModalStatus, setMapTemplateModalStatus] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);


    useEffect(() => {
        if(auth.user)
        {
                if(auth.user.role == "admin")
            {
                history.push("/admin-home/")
            }
            else if(auth.user.role == "banned"){
                handleBanUserLoginModal();
            }
        }
        // const role = auth.user.role
        store.loadIdNamePairs();
    }, []);

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

    const handleRenderButtonClick = () => {
        renderGeoJSON();
    };
    const handleselectasc = (value) => {
        store.sortCreationDatesAsc();
       }
    
       const handleselectdesc = (value) => {
        store.sortCreationDatesDesc();
       }
    
       const handleselectlikes = (value) => {
        store.sortLikes();
       }
    
       const handleselectdisLikes = (value) => {
        store.sortDisLikes();
       }

  const renderGeoJSON = () => {
    if (map) {// if map variable from stat e exists(load map function excute successfully)
        const thisMap = map;//assgin map variable from state
            try {
                const geojsonData = store.currentMap.mapObjects;; //Parse the data of GeoJSON file
                console.log(geojsonData)
                const geojsonLayer = L.geoJSON(geojsonData, { //create geojason layer
                    onEachFeature : onEachFeature //calls oneachFeature function
                }).addTo(thisMap); //adds the geojason layer to the leaft map.

            function onEachFeature(feature, layer) { //onEachFeature function
                let featureArray = []; //create an empty array to store all the features
                 if (feature.properties) {
                    for (let i in feature.properties) { //for loop to loop the feature
                        featureArray.push(i + ": " + feature.properties[i]);//put the feature into the arrayls
                    }

                    layer.bindTooltip(featureArray.join("<br />"));
                }
            }

            thisMap.fitBounds(geojsonLayer.getBounds());//make the layer and map fit to each other
            }
            catch (error) {
                console.error('Error rendering GeoJSON:', error);
        }
    };
}
    
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
        store.createNewMap();
   }

   const handlePublishButton = () =>{
        store.publishMap(store.currentMap._id);
        console.log("publish done")
   }

   const handleDeleteButton =()=>{
        store.markMapForDeletion(store.currentMap._id);
   }

   const handlePublic =()=>{
        setIsBorderVisible(!isBorderVisible);
        setPublicList(true);

   }
   const handlePrivate=()=>{
        setIsBorderVisible(!isBorderVisible);
        setPublicList(false);
   }

   const handleCloseButton =() =>{
        store.closeCurrentMap();
        setcurrent(null);
        map.remove(); 
        setMap(null);
   }
   const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
};


const handleMenuClose = () => {
    setAnchorEl(null);
};


   const handleSelectFileButton = () => {
        setMapTemplateModalStatus(true);
    };
    const sortByMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleselectlikes}>Likes(High - Low)</MenuItem>
            <MenuItem onClick={handleselectdisLikes}>Dislikes(High - Low)</MenuItem>
            <MenuItem onClick={handleselectasc}>Creation Date(asc)</MenuItem>
            <MenuItem onClick={handleselectdesc}>Creation Date(desc)</MenuItem>
        </Menu>
    )

    const handleMapTemplateModalConfirm = ({ file, mapType }) => {
        // Handle the selected file and map type in your HomeScreen component
        console.log('Selected File:', file);
        console.log('Map Type:', mapType);
        //save the mapType state
        setMapType(mapType)
        const reader = new FileReader();
        if (file) {
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            console.log("fileExtension is " + fileExtension)

            if (fileExtension === 'shp'){
                reader.onload = async (e) => {// event handler for FileReader
                    try {
                        const arrayBuffer = e.target.result; // FileReader result is an ArrayBuffer
                        const geojsonData = await shapefile.read(arrayBuffer);
                        store.storeFile(store.currentMap._id, geojsonData,mapType)
                    } catch (error) {
                      console.error('Error storing Shapefile:', error);
                    }
                  };
                reader.readAsArrayBuffer(file);//used to read the contents of the specified file
                //const uploadButton = document.getElementById('Select-File-Button');
                //uploadButton.disabled = true;
            } else if (fileExtension === 'json') {
                reader.onload = (e) => {// event handler for FileReader
                    try {
                        const geojsonData = JSON.parse(e.target.result); //Parse the data of GeoJSON file
                        console.log("home screen storefile");
                        store.storeFile(store.currentMap._id, geojsonData,mapType)
                        //console.log("right after storefile")
                    }
                    catch (error) {
                        console.error('Error storing GeoJSON:', error);
                    }
                }
                reader.readAsText(file);
                //const uploadButton = document.getElementById('Select-File-Button');
                //uploadButton.disabled = true;
                //loadMap();
            }
            else if (fileExtension === 'kml') {
                reader.onload = (e) => { // event handler for FileReader
                    const kmlContent = e.target.result; 
                    const geojsonData = toGeoJSON.kml(new DOMParser().parseFromString(kmlContent, 'text/xml')); //Parse the data from KML file into GeoJSON type
                    store.storeFile(store.currentMap._id, geojsonData,mapType)
                }
                reader.readAsText(file); //intiate the selected file
                //const uploadButton = document.getElementById('Select-File-Button');
                //uploadButton.disabled = true;
            }
            else {
                alert('Please select a valid SHP, GeoJSON, or KML file.');
            }
        } else {
            //const uploadButton = document.getElementById('Select-File-Button');
            //uploadButton.disabled = false;
        }
      };

    function handleEditNameClick(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setMapNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            //let id = event.target.id.substring("Map-".length);
            store.changeMapName(store.currentMap._id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleToogleopen(event){
        // if (store.currentList != null){setOpen(!open);}
        setOpen(!open);
     }

    function handleBanUserLoginModal() {
        // Handle the logic to show the ban user modal
        setOpenBanUserLoginModal(true);
    }

    function handleForkButton(){
        store.forkMap(store.currentMap._id)    
    }

    let selectClass = "unselected-map-card";
    if (store.currentMap) {
        selectClass = "selected-map-card";
    }

    let listCard = "";
    //load only public map
    if (store && publicList) {
        if (store.searchText === ""){
            console.log("public list")
            listCard = 
            <div>
                {
                    store.idNamePairs.filter((pair) => pair.authorName === auth.user.firstName + " " + auth.user.lastName)
                    .filter((pair) => pair.publishStatus === true).map((pair) => (
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
        } else {
            listCard = 
            <div>
                {
                    store.idNamePairs.filter((pair) => pair.authorName === auth.user.firstName + " " + auth.user.lastName)
                    .filter((pair) => pair.publishStatus === true)
                    .filter((pair) => pair.name.toLowerCase().includes(store.searchText)).map((pair) => (
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
    //load only private map
    else {
        if (store.searchText === ""){
            console.log("private list")
            listCard = 
            <div>
                {
                    store.idNamePairs
                    .filter((pair) => pair.authorName === auth.user.firstName + " " + auth.user.lastName)
                    .filter((pair) => pair.publishStatus === false)
                        .map((pair) => (
                            <MapList
                                key={pair._id}
                                idNamePair={pair}
                                publish={pair.publishStatus}
                                publishDate={pair.publishDate}
                                likes={pair.likes}
                                disLikes={pair.disLikes}
                            />
                        ))
                }
            </div>
        }else {
            listCard = 
            <div>
                {
                    store.idNamePairs
                    .filter((pair) => pair.authorName === auth.user.firstName + " " + auth.user.lastName)
                    .filter((pair) => pair.publishStatus === false)
                    .filter((pair) => pair.name.toLowerCase().includes(store.searchText))
                        .map((pair) => (
                            <MapList
                                key={pair._id}
                                idNamePair={pair}
                                publish={pair.publishStatus}
                                publishDate={pair.publishDate}
                                likes={pair.likes}
                                disLikes={pair.disLikes}
                            />
                        ))
                }
            </div>
        }

    }
  
   return (
       <div >
        <div style={{ display: 'flex', flexDirection: 'column',maxHeight:'630px'}}>
       <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '30px'}} id = "navigation-bar" >
           <IconButton style = {{color:'black'}}> <AddCircleIcon onClick={handleAdd} style={{fontSize: '2rem'}}></AddCircleIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <PublishedWithChangesIcon onClick={handlePublic} style={{ fontSize: '2rem',border: isBorderVisible ? '2px solid black' : 'none' }}></PublishedWithChangesIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <LockIcon onClick={handlePrivate} style={{ fontSize: '2rem',border: !isBorderVisible ? '2px solid black' : 'none' }}></LockIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <SortIcon style={{fontSize: '2rem'}}></SortIcon></IconButton>{sortByMenu}
       </Box>
       
       <div style={{ width: '29%', overflow: 'scroll' }}>
        <List sx={{ bgcolor: '#ABC8B2', mb:"20px"}}>  
            {listCard}
        </List>
       </div>
        <MUIDeleteModal/>
        <MUIBanUserLoginModal open={openBanUserLoginModal} handleClose={handleBanUserLoginModal} />
       </div>
       <div id = "map-name" style={{fontSize: '2rem'}}>
       {editActive ? (
        <TextField
          type="text"
          onKeyPress={handleKeyPress}
          onChange={handleUpdateText}
          autoFocus
        />
       ) : (
        <>
          {store.currentMap != null? store.currentmapName: "" }
          <IconButton onClick={handleEditNameClick}>
            <EditIcon style={{ fontSize: '2rem' }}></EditIcon>
          </IconButton>
        </>
       )}
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
       </div> ):<div id = "container" class="element-with-stroke"></div>}
      
       <div id = "function-bar" class="element-with-stroke">
           <Button className='button' id="Select-File-Button"
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={!store.currentMap|| store.currentMap.mapTemplate != "null"}
                   onClick={handleSelectFileButton}>select File</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={!store.currentMap}
                   onClick={handleForkButton}>Fork</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={!store.currentMap}
                   onClick={handleEditButton}>Edit</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={!store.currentMap}
                   onClick={handleRenderButtonClick}>Render</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={!store.currentMap}
                   onClick = {handlePublishButton}>Publish</Button>
           <Button className='button' 
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={!store.currentMap}
                   onClick={handleDeleteButton}>Delete</Button>
       </div></List>
       <MapTemplateModal open={MapTemplateModalStatus} handleClose={setMapTemplateModalStatus} onConfirm={handleMapTemplateModalConfirm} />
       </div>)
}


export default HomeScreen;


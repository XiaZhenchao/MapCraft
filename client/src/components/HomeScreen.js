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

/*
   This React component lists all the top5 lists in the UI.
  
   @author McKilla Gorilla
*/
const HomeScreen = () => {
   const { store } = useContext(GlobalStoreContext);
   const { auth } = useContext(AuthContext);
   const [selectedFile, setSelectedFile] = useState(null);
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
    useEffect(() => {
        // console.log("auth.user in home: "+auth.user.email);
        // console.log("auth.user in home: "+auth.user.lastName);
        // console.log("auth.user in home: "+auth.user.firstName);
        // console.log("auth.user in home: "+auth.user.role);
        if(auth.user)
        {
                if(auth.user.role == "admin")
            {
                history.push("/admin-home/")
            }
            else if(auth.user.role == "banned"){
                auth.logoutUser();
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

    const handleFileInputChange = () => {
        const fileInput = document.getElementById('fileInput');
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const fileName = selectedFile.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (fileExtension === 'shp' || fileExtension === 'json' || fileExtension === 'kml'){
                setSelectedFile( selectedFile );
                const uploadButton = document.getElementById('Select-File-Button');
                uploadButton.disabled = true;
                loadMap();
                setFileExtension( fileExtension );
            } else if (fileExtension === 'zip') {
                setSelectedFile( selectedFile );
                const uploadButton = document.getElementById('Select-File-Button');
                uploadButton.disabled = true;
                loadMap();
                setFileExtension( fileExtension );
            }
            else {
                alert('Please select a valid SHP, GeoJSON, or KML file.');
            }
        } else {
                setSelectedFile( null );
            const uploadButton = document.getElementById('Select-File-Button');
            uploadButton.disabled = false;
        }
    };

    const handleRenderButtonClick = () => {
    setRendering( rendering );
    if(fileExtension==="json"){
        renderGeoJSON();
        setRendering( rendering );
    }
    if(fileExtension==="kml"){
        renderKMLFile();
        setRendering( rendering );
    }
    if(fileExtension==="shp"){
       renderShpFile();
       setRendering( rendering );
    }
};


const renderShpFile = () => {
    const reader = new FileReader();// FileReader class for reading file
    if (map) {// if map variable from state exists(load map function excute successfully)
      const thisMap = map;//assgin map variable from state
      reader.onload = async (e) => {// event handler for FileReader
        try {
            const arrayBuffer = e.target.result; // FileReader result is an ArrayBuffer
            const geojsonData = await shapefile.read(arrayBuffer);
  
          const geojsonLayer = L.geoJSON(geojsonData).addTo(thisMap);//adds the geojason layer to the leaft map.
  
          thisMap.fitBounds(geojsonLayer.getBounds());//make the layer and map fit to each other
        } catch (error) {
          console.error('Error rendering Shapefile:', error);
        }
      };
  
      reader.readAsArrayBuffer(selectedFile);//used to read the contents of the specified file
    }
  };


  const renderGeoJSON = () => {
    const reader = new FileReader();// FileReader class for reading file
    if (map) {// if map variable from state exists(load map function excute successfully)
        const thisMap = map;//assgin map variable from state
        reader.onload = (e) => {// event handler for FileReader
            try {
                const geojsonData = JSON.parse(e.target.result); //Parse the data of GeoJSON file
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
        }

    reader.readAsText(selectedFile);//used to read the contents of the specified file
    };
}


const renderKMLFile = () => {
    const reader = new FileReader(); // FileReader class for reading file
    if (map) {// if map variable from state exists(load map function excute successfully)
        const thisMap = map; //assgin map variable from state
        reader.onload = (e) => { // event handler for FileReader
        const kmlContent = e.target.result; 
        const geojson = toGeoJSON.kml(new DOMParser().parseFromString(kmlContent, 'text/xml')); //Parse the data from KML file into GeoJSON type
        const geojsonLayer = L.geoJSON(geojson, {
            onEachFeature : onEachFeature
         }).addTo(thisMap);

         function onEachFeature(feature, layer) {
            let featureArray = [];
             if (feature.properties) {
                for (let i in feature.properties) {
                    featureArray.push(i + ": " + feature.properties[i]);
                }

                layer.bindTooltip(featureArray.join("<br />"));
             }
         }
         thisMap.fitBounds(geojsonLayer.getBounds());//make the layer and map fit to each other
         }
    reader.readAsText(selectedFile); //intiate the selected file
    }
}
   
    const handleCancelClick = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.value = '';
        
        if(map!=null){
            setMap(null) // Remove the old map
        }       

        setSelectedFile(null)
        setRendering(false)
        handleFileInputChange();
    };

 
    
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

   const handleSelectFileButton = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.accept = '.zip,.shp,.json,.kml,.dbf';
        fileInput.click();
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

    let selectClass = "unselected-map-card";
    if (store.currentMap) {
        selectClass = "selected-map-card";
    }


   let listCard = "";
    //load only public map
    if (store && publicList) {
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

    }
    //load only private map
    else {
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
       
       <List sx={{ bgcolor: '#ABC8B2', mb:"20px",
            overflow: 'scroll'}}>  
            {listCard}
        </List>
        <MUIDeleteModal/>
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
       <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                />
           <Button className='button' id="Select-File-Button"
                    disabled={selectedFile!=null}
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   onClick={handleSelectFileButton}>select File</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Fork</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   onClick={handleEditButton}>Edit</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   onClick={handleRenderButtonClick}>Render</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   onClick = {handlePublishButton}>Publish</Button>
           <Button className='button' 
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   onClick={handleDeleteButton}>Delete</Button>
                    {selectedFile!=null && (
                    <div>
                        <p>Selected File: {selectedFile.name}</p >
                        <button onClick={handleCancelClick}>Cancel</button>
                    </div>
                )}
       </div></List>
      
       </div>)
}


export default HomeScreen;


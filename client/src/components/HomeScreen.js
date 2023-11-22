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

/*
   This React component lists all the top5 lists in the UI.
  
   @author McKilla Gorilla
*/
const HomeScreen = (props) => {
   const { store } = useContext(GlobalStoreContext);
   const { auth } = useContext(AuthContext);

   const [selectedFile, setSelectedFile] = useState(null);
   const [map, setMap] = useState(null);
   const history = useHistory();
   const [isBorderVisible, setIsBorderVisible] = useState(false);
   const { idNamePairs, selected } = props;
   const [fileExtension, setFileExtension] = useState(null);
   const [rendering, setRendering] = useState(false);
  

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
                //this.loadMap(selectedFile);
                setFileExtension( fileExtension );
            } else if (fileExtension === 'zip') {
                setSelectedFile( selectedFile );
                const uploadButton = document.getElementById('Select-File-Button');
                uploadButton.disabled = true;
                //this.loadMap(selectedFile);
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
   
const handleCancelClick = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.value = '';
        // const container = document.getElementById('Container');
        // container.innerHTML = '';
        
        if(map!=null){
            setMap(null) // Remove the old map
        }       

        setSelectedFile(null)
        setRendering(false)
        handleFileInputChange();
    };

  useEffect(() => {
        store.loadIdNamePairs();
    }, []);
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
        store.createNewMap();
   }

   const handleDeleteButton =()=>{
        store.markMapForDeletion(store.currentMap._id);
   }

   const handlePublic =()=>{
        setIsBorderVisible(!isBorderVisible);
   }
   const handlePrivate=()=>{
        setIsBorderVisible(!isBorderVisible);
   }

   const handleSelectFileButton = () => {
        const fileInput = document.getElementById('fileInput');
        fileInput.accept = '.zip,.shp,.json,.kml,.dbf';
        fileInput.click();
    };


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
       <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '30px'}} id = "navigation-bar" >
           <IconButton style = {{color:'black'}}> <AddCircleIcon onClick={handleAdd} style={{fontSize: '2rem'}}></AddCircleIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <PublishedWithChangesIcon onClick={handlePublic} style={{ fontSize: '2rem',border: isBorderVisible ? '2px solid black' : 'none' }}></PublishedWithChangesIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <LockIcon onClick={handlePrivate} style={{ fontSize: '2rem',border: !isBorderVisible ? '2px solid black' : 'none' }}></LockIcon></IconButton>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <IconButton style = {{color:'black'}}> <SortIcon style={{fontSize: '2rem'}}></SortIcon></IconButton>
       </Box>
       
       <List sx={{ bgcolor: '#ABC8B2', mb:"20px" ,
            overflow: 'auto'}}>  
            {listCard}
        </List>
        <MUIDeleteModal/>
       </div>
       <div id = "map-name" style={{fontSize: '2rem'}}>Map1 <IconButton ><EditIcon style={{fontSize: '2rem'}}></EditIcon></IconButton>
       </div>
       <Box  id = "export-close"><ExitToAppIcon style={{fontSize: '2rem'}}></ExitToAppIcon><CloseIcon style={{fontSize: '2rem'}}></CloseIcon></Box>
       <List id = "Mapview" >
       <div id = "container" class="element-with-stroke">
      
       </div>
      
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
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Render</Button>
           <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Publish</Button>
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


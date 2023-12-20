import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
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
import Tooltip from '@mui/material/Tooltip';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import MUIDeleteModal from './MUIDeleteModal.js';
import TextField from '@mui/material/TextField';
import toGeoJSON from 'togeojson';
import * as shapefile from 'shapefile';
import MUIBanUserLoginModal from './MUIBanUserLoginModal.js';
import MapTemplateModal from './MapTemplateModal.js';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import 'leaflet.heat/dist/leaflet-heat.js'; 
import 'leaflet-easyprint';
import locate from '../location.png';

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
   const [heatLayer, setHeatLayer] = useState(null);
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
                history.push("/community/")
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

//   const renderGeoJSON = () => {
//     if (map) {// if map variable from stat e exists(load map function excute successfully)
//         const thisMap = map;//assgin map variable from state
//             try {
//                 const geojsonData = store.currentMap.mapObjects;; //Parse the data of GeoJSON file
//                 const geojsonLayer = L.geoJSON(geojsonData, { //create geojason layer
//                     onEachFeature: function (feature, layer) {
//                         // Check if the feature has a 'name' property (replace 'name' with the actual property name containing region names)
//                         if (feature.properties && feature.properties.name_en) {
//                             console.log(feature.type);
//                             console.log(feature.geometry.type);
//                             console.log(feature.geometry.coordinates);
//                             console.log(feature.properties.name_en);
//                             layer.bindPopup(feature.properties.name_en);
                             
//                             layer.on({
//                                 click: (event) => {
//                                     event.target.setStyle({
//                                         color: "green",
//                                         fillColor: "yellow",
//                                     })
//                                 }
//                             })
//                         }
                        
//                     },
//                 }).addTo(thisMap); //adds the geojason layer to the leaft map.

//                 // Sample heat map data (latitude, longitude, intensity)
//             const heatData = [
//                 [0, 0, 1],
//                 [10, 10, 0.5],
//                 [11, 3, 4],
//                 // Add more data points as needed
//             ];

//             // Create the heat layer
//             const heatLayer = L.heatLayer(heatData, { radius: 25 });

//             // Add the heat layer to the map
//             heatLayer.addTo(thisMap);

//             // Fit the map bounds to the GeoJSON layer
//             thisMap.fitBounds(geojsonLayer.getBounds());
            
//             // Set the heat layer in state or perform other necessary operations
//             setHeatLayer(heatLayer);

//             }
//             catch (error) {
//                 console.error('Error rendering GeoJSON:', error);
//         }
//     };
// }
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
                    // thisMap.fitBounds(geojsonBounds);

                }
                catch (error) {
                    console.error('Error rendering GeoJSON:', error);
            }
        };
    }

    const renderChoro = (mapInstance) => {
        if (mapInstance) {
          const geojsonData = store.currentMap.mapObjects;
    
          const geojsonLayer = L.geoJSON(geojsonData, {
            style: (feature) => {
              for (let i = 0 ; i < store.currentMap.choroplethMapArray.length; i++){
                if (feature.properties.name_en === store.currentMap.choroplethMapArray[i].regionName){
                    return {
                        fillColor: store.currentMap.choroplethMapArray[i].choroplethColor,
                        color: 'blue',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8,
                    }
                }
              }
            },
            onEachFeature: (feature, layer) => {
              layer.on({
                mouseover: (event) => {
                  const hoveredLayer = event.target;
                  hoveredLayer.setStyle({
                    weight: 3,
                    color: 'black',
                    fillOpacity: 1,
                  });
    
                  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    hoveredLayer.bringToFront();
                  }
                },
                mouseout: (event) => {
                  const hoveredLayer = event.target;
                  hoveredLayer.setStyle({
                    weight: 1,
                    color: 'blue',
                    fillOpacity: 0.8,
                  });
                },
                click: (event) => {
                  const clickedFeature = event.target.feature.properties;
                  //handleRegionClick(clickedFeature);
                },
              });
    
              layer.bindPopup((layer) => {
                const properties = layer.feature.properties;
                for (let i = 0 ; i < store.currentMap.choroplethMapArray.length; i++){
                    if (feature.properties.name_en === store.currentMap.choroplethMapArray[i].regionName){
                        return `Region: ${properties.name_en}<br>${store.currentMap.choroplethMapArray[i].densityOption}: ${store.currentMap.choroplethMapArray[i].data}`; // Adjust accordingly
                    }
                }
              });
            },
        }).addTo(mapInstance);
    
          const geojsonBounds = geojsonLayer.getBounds();
          map.fitBounds(geojsonBounds);
        }
    }

    const renderEdits=(mapInstance)=>{
        const AllChanges = store.currentMap.customLabel
        if (AllChanges.length>0){
          console.log("current changes: ",AllChanges);
          AllChanges.forEach(function (EditItem) {
            if (EditItem["type"]=="text label"){
              const currentZoom = mapInstance.getZoom();
              const iconAnchor = [10 * currentZoom, 10 * currentZoom];
              const customLabelIcon = L.divIcon({
                className: 'custom-label',
                html: `<div style="font-family: ${EditItem["fontFamily"]}; color: ${EditItem["color"]}; font-size:${EditItem["font-size"]}px">${EditItem["labelText"]}</div>`,
                iconSize: [20,20],
                iconAnchor: iconAnchor,
              });
              console.log('Custom label icon:', customLabelIcon);
              L.marker(EditItem["coordinates"], { icon: customLabelIcon}).addTo(mapInstance);
            }
            else if (EditItem["type"]=="location label"){
              const locationLogoIcon = L.icon({
                iconUrl: locate,
                iconSize: [25, 25],
                iconAnchor: [25, 25],
              });
              L.marker(EditItem["coordinates"], {
                icon: locationLogoIcon,
                zIndexOffset: 2000,
                draggable: false
              }).addTo(mapInstance);
            }
            else if (EditItem["type"]=="legend"){
              // Check if legend is initialized
              if (EditItem["Legend Items"].length==0 || !EditItem["isCheck"]){
                return null;
              }
              // Create a new legend based on the updated legendItems
              const legend = L.control({ position: 'bottomleft' });
              legend.onAdd = function () {
                var div = L.DomUtil.create('div', 'legend');
                div.innerHTML += '<h4>' + EditItem["legend name"]+ '</h4>';
                EditItem["Legend Items"].forEach(function (legendItem) {
                  div.innerHTML +=
                    '<i style="background: ' + legendItem.color + '"></i><span>' + legendItem.description + '</span><br>';
                });
                return div;
              };
              if (mapInstance!=null){
                legend.addTo(mapInstance);
              }
              else{
                console.log('null!!!')
              }
            }
          });
        }
      }
    
  const loadMap = () => {
    try {
            const mapInstance = L.map('container').setView([0, 0], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
            }).addTo(mapInstance);

            setMap(mapInstance);
            renderGeoJSON(mapInstance)
            console.log("map object data is " +store.currentMap.mapObjects)

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

            if (store.currentMap.mapTemplate=='choroplethMap'){
                console.log(store.currentMap.choroplethMapArray);
                if (store.currentMap.choroplethMapArray && store.currentMap.choroplethMapArray.length > 0){
                    renderChoro(mapInstance)
                }
            }
            
            if (store.currentMap.mapTemplate=="regular"){
                renderEdits(mapInstance);
            }
            
    } catch (error) {
      console.error('Error loading map:', error);
    }
  };

   const handleEditButton = () => {
       if(store.currentMap.mapTemplate=="heatMap"){
            history.push("/edit-heat-map/");
       }
       else if(store.currentMap.mapTemplate=="choroplethMap"){
            history.push("/edit-choropleth-map/")
       }
       else if(store.currentMap.mapTemplate=="dotDensityMap"){
            history.push("/edit-dotDensity-map/")
       }
       else if(store.currentMap.mapTemplate=="voronoiMap"){
            history.push("/edit-voronoi-map/")
       }
       else{
            history.push("/edit/");
       }
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
                        geojsonData.features.forEach(feature => {
                            const coordinates = feature.geometry.coordinates;
                            const regionName = feature.properties.name_en;
                            console.log("coordinates: ", coordinates);
                            console.log("regionName: ", regionName);
                        });
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
                        const coordinateArray = [];
                        const regionNameArray = [];
                        geojsonData.features.forEach(feature => {
                            //const coordinates = feature.geometry.coordinates;
                            const regionName = feature.properties.name_en;
                            //console.log("coordinates: ", coordinates);
                            console.log("regionName: ", regionName);
                            //coordinateArray.push(coordinates);
                            regionNameArray.push(regionName);
                            feature.geometry.coordinates.forEach(polygon => {
                                polygon.forEach(ring => {
                                    ring.forEach(coordinate => {
                                        coordinateArray.push(coordinate);
                                    });
                                });
                            })
                        });

                        store.saveLayerData(store.currentMap._id,coordinateArray, regionNameArray);
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

    const handleExportButton = () =>{
        if (map) { // Assuming 'map' is set in your state and properly updated via 'setMap'
            // Create the easyPrint control and add it to the map instance
            var printer = L.easyPrint({
                filename: 'myMap',
                exportOnly: true,
                hideControlContainer: true,
                hidden: true,
            }).addTo(map);
            printer.printMap('CurrentSize', 'MyManualPrint');
        } else {
            console.error('Map instance not found.'); // Log an error if the map instance is missing
        }

    };

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
                            createDate = {pair.createDate}
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
                            createDate = {pair.createDate}
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
                                createDate = {pair.createDate}
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
       <div id = 'app-root'>
        <div style={{ display: 'flex', flexDirection: 'column',height: '100%', maxHeight:'600px'}}>
       <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '30px'}} id = "navigation-bar" >
       <Tooltip title="Create Map" arrow>
            <IconButton className="tooltip" style={{ color: 'black',  marginRight: '8px' }} onClick={handleAdd}>
                <AddCircleIcon style={{ fontSize: '2rem' }} />
            </IconButton>
            </Tooltip>
        <Tooltip title="Public Map" arrow>
            <IconButton style={{ color: 'black', marginRight: '8px' }}>
            <PublishedWithChangesIcon
                onClick={handlePublic}
                style={{
                fontSize: '2rem',
                border: isBorderVisible ? '2px solid black' : 'none',
                }}
            />
            </IconButton>
      </Tooltip>
      <Tooltip title="Private Map" arrow>
        <IconButton style={{ color: 'black', marginRight: '8px' }}>
          <LockIcon
            onClick={handlePrivate}
            style={{
              fontSize: '2rem',
              border: !isBorderVisible ? '2px solid black' : 'none',
            }}
          />
        </IconButton>
      </Tooltip>

      <Tooltip title="Sorting" arrow>
        <IconButton onClick={handleProfileMenuOpen} style={{ color: 'black'}}>
          <SortIcon style={{ fontSize: '2rem' }} />
        </IconButton>
      </Tooltip>

      {sortByMenu}
       </Box>
       
       <div style={{ width: '29%', height: '100%',  overflow: 'scroll' }}>
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
          {store.currentMap != null? 
          <IconButton onClick={handleEditNameClick} title="Edit Name">
            <EditIcon style={{ fontSize: '2rem' }} />
          </IconButton>:null}
        </>
       )}
       </div>
       <Box  id = "export-close">
       <Tooltip title="Export" arrow>
            <IconButton disabled={!store.currentMap} onClick={handleExportButton}>
            <ExitToAppIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
       </Tooltip>
       <Tooltip title="Close" arrow>
            <IconButton disabled={!store.currentMap} onClick={handleCloseButton}>
            <CloseIcon style={{ fontSize: '1.5rem' }} />
            </IconButton>
       </Tooltip>
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
           {/* <Button className='button'
                   sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                   disabled={!store.currentMap}
                   onClick={handleRenderButtonClick}>Render</Button> */}
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


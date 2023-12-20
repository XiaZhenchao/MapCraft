import React, { useContext, useEffect, useState, useRef } from 'react';
import { GlobalStoreContext } from '../store';
import BackHandIcon from '@mui/icons-material/BackHand';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimelineIcon from '@mui/icons-material/Timeline';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import { useHistory } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw/dist/leaflet.draw';
import 'leaflet-editable';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import locate from '../location.png';
import { Slider, IconButton, Button, Box, Popover, List, ListItem, ListItemText, Typography } from '@mui/material';
const EditScreen = () => {
 const { store } = useContext(GlobalStoreContext);
 const [map, setMap] = useState(null);
 const [AllChanges,setAllChanges] = useState(store.currentMap.customLabel);
 const [history, setHistory] = useState([]);
 const [historyIndex, setHistoryIndex] = useState(0);
 const [markers,setmarkers] = useState([]);
 const [needreload, setneedreload] = useState(false);
 // const [drag, setdrag] = useState(false);
 const [editOption, seteditOption] = useState('');
 const [fontFamily, setFontFamily] = useState('Arial');
 const [anchorEl, setAnchorEl] = useState(null);
 const [selectedColor, setSelectedColor] = useState('#000000');
 const [fontSize, setFontSize] = useState(16);
 const [legendName, setLegendName] = useState("");
 const [isChecked, setChecked] = useState(false);
 const [legendColor, setLegendColor] = useState("#000000"); // Initial color value
 const [LegendDescription,setLegendDescription] = useState("");
 const [legendItems, setLegendItems] = useState([]);
 const [isModalOpen, setModalOpen] = useState(false);
 const [existlegend,setLegend] = useState(null);
 const selectedColorRef = useRef(selectedColor);
 const selectFontSizeRef = useRef(fontSize);
 const selectFontRef = useRef(fontFamily);
 const history2 = useHistory();
 const fontOptions = [
   'Arial',
   'Helvetica',
   'Times New Roman',
   'Georgia',
   'Verdana',
   'Trebuchet MS',
   'Tahoma',
   'Courier New',
   'Lucida Console',
   'Palatino',
   'Garamond',
   'Book Antiqua',
   'Palatino Linotype',
   'Impact',
   'Arial Black',
   'Lucida Sans Unicode',
   'Courier',
   'monospace',
   'serif',
   'sans-serif',
   ];
 let drawControl;
 let legend;


 useEffect(() => {
 // Load the map when the component mounts
 initializeMap();
 }, []); // The empty dependency array ensures it runs once on mount


 useEffect(() => {
   console.log("AllChanges Updated",AllChanges);
   if(needreload){
     renderEdits(map);
     setneedreload(false);
   }
   else{
     // const newHistory = history.slice(0, historyIndex + 1);
     // setHistory([...newHistory, AllChanges]);
     setHistory((prevhistory) => {
       console.log("index: ", historyIndex)
       const newHistory = prevhistory.slice(0, historyIndex + 1);
       return [...newHistory, AllChanges]
      
     });
   }
 }, [AllChanges]);


 useEffect(() => {
   const handleMarkerDragEnd = (event, markerData) => {
     const newCoordinates = event.layer.getLatLng();
     const updatedMarkerData = { ...markerData, coordinates: newCoordinates };
      // Update the AllChanges state
     setAllChanges((prevAllChanges) => {
       const updatedChanges = prevAllChanges.map((change) =>
         change === markerData ? updatedMarkerData : change
       );
       return updatedChanges;
     });
      // Increment the history index
     setHistoryIndex((prev) => prev + 1);
   };
    markers.forEach(marker => {
     marker[0].on('click', () => {
       console.log("Option: ",editOption)
       if (editOption=="remove"){
         map.removeLayer(marker[0]);
         setmarkers(prevMarkers => prevMarkers.filter(m => m !== marker));
         setAllChanges((prev)=>prev.filter(m => m!==marker[1]));
         setHistoryIndex((prev)=>(prev+1))
       }
     });
     marker[0].on('editable:dragend', (event) => {
       handleMarkerDragEnd(event, marker[1]);
     });
   });
   return () => {
     markers.forEach(marker => {marker[0].off('click');marker[0].off('editable:dragend')});
   };
 }, [markers,editOption])


 useEffect(() => {
   console.log("history Updated",history);
 }, [history]);
 useEffect(() => {
   console.log("historyIndex Updated",historyIndex);
 }, [historyIndex]);
 useEffect(() => {
   console.log("markers Updated",markers);
 }, [markers]);
 useEffect(() => {
 selectedColorRef.current = selectedColor;
 }, [selectedColor]);
 useEffect(() => {
 selectFontSizeRef.current = fontSize;
 }, [fontSize]);
 useEffect(() => {
 selectFontRef.current = fontFamily;
 }, [fontFamily]);
 useEffect(() => {
 if (editOption !== 'addtext' && map !== null) {
   map.off('click');
   setFontFamily('Arial');
   setSelectedColor('black');
   setFontSize(16);
 }
 if (map!==null){
   const mapContainer = map.getContainer();
   if (editOption=="remove"){
     mapContainer.classList.add('custom-cursor');
   }
   else{
     mapContainer.classList.remove('custom-cursor');
   }
 }
  }, [editOption, map]);


 useEffect(() => {
   console.log("EditOption: ",editOption);
  
   }, [editOption]);
 // Use useEffect to call updateLegend whenever legendItems change
 useEffect(() => {
   if (map) {
     updateLegend();
   }
 }, [legendItems,isChecked,legendName,map]);
 const handleLegendNameChange = (event) => {
   setLegendName(event.target.value);
 };
 const handleCheckboxChange = (event) => {
   setChecked(event.target.checked);
 };
 const handleColorChange = (event) => {
   setLegendColor(event.target.value);
 };
 const handleLegendDescriptionChange = (event) => {
   setLegendDescription(event.target.value);
 };
 const handleInsertLegendClick = () => {
   // Open the modal for user input
   setModalOpen(true);
 };
 const handleModalClose = () => {
   // Close the modal
   setModalOpen(false);
 };
 const handleDoneClick = () => {
   // Check if color and description are provided
   if (!LegendDescription || !legendColor) {
     // Optionally, display an error message or handle the situation accordingly
     return;
   }
   // Create a new legend item
   const newLegendItem = {
     color: legendColor,
     description: LegendDescription,
   };
   // Update the state with the new legend item
   setLegendItems([...legendItems, newLegendItem]);
   // Reset the form fields
   setLegendDescription("");
   setLegendColor("#000000"); // Set a default color or an initial color value
   // Close the modal
   setModalOpen(false);
 };
 const handleRemoveLegendClick = (index) => {
   // Remove a legend item by index
   const updatedLegends = [...legendItems];
   updatedLegends.splice(index, 1);
   setLegendItems(updatedLegends);
 };
 const updateLegend = () => {
   if (existlegend!=null&&map!=null) {
     map.removeControl(existlegend);
     // setLegend(null);
   }
   // Check if legend is initialized
   if (legendItems.length==0 || !isChecked){
     const legenddata = AllChanges.filter(m => m["type"] === "legend")
     if (legenddata.length>0){
       const le = legenddata[0]
       const textlabel = {"type":"legend","isCheck":isChecked,"legend name": legendName,"Legend Items":legendItems}
       if(((le["isCheck"]==textlabel["isCheck"])&&(le["Legend Items"]==textlabel["Legend Items"]))){
        
       }
       else{
         setAllChanges((prevAllChanges) => [...prevAllChanges.filter(m => m["type"] !== "legend")]);
         setHistoryIndex((prev)=>(prev+1));
       }
     }
     return null;
   }
   // Create a new legend based on the updated legendItems
   legend = L.control({ position: 'bottomleft' });
   legend.onAdd = function (map) {
     var div = L.DomUtil.create('div', 'legend');
     div.innerHTML += '<h4>' + legendName + '</h4>';
     legendItems.forEach(function (legendItem) {
       div.innerHTML +=
         '<i style="background: ' + legendItem.color + '"></i><span>' + legendItem.description + '</span><br>';
     });
     return div;
   };
   const textlabel = {"type":"legend","isCheck":isChecked,"legend name": legendName,"Legend Items":legendItems}
   setLegend(legend);
   // Add the updated legend to the map
   if (map!=null){
     legend.addTo(map);
     const legenddata = AllChanges.filter(m => m["type"] === "legend")
     if (legenddata.length>0){
       const le = legenddata[0]
       console.log("T/F: ",le["isCheck"]==textlabel["isCheck"])
       console.log("T/F: ",le["Legend Items"]==textlabel["Legend Items"])
       console.log("T/F: ",le["legend name"]==textlabel["legend name"])
       if(!((le["isCheck"]==textlabel["isCheck"])&&(le["Legend Items"]==textlabel["Legend Items"])&&(le["legend name"]==textlabel["legend name"]))){
         setAllChanges((prevAllChanges) => [...prevAllChanges.filter(m => m["type"] !== "legend"), textlabel]);
         setHistoryIndex((prev)=>(prev+1));
       }
     }
     else{
       setAllChanges((prevAllChanges) => [...prevAllChanges.filter(m => m["type"] !== "legend"), textlabel]);
       setHistoryIndex((prev)=>(prev+1));
     }   
   }
   else{
     console.log('null!!!')
   }
 };
 const renderEdits=(mapInstance)=>{
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
         const marker = L.marker(EditItem["coordinates"], { icon: customLabelIcon}).addTo(mapInstance);
         marker.enableEdit();
         // Listen for the 'editable:dragend' event (triggered after dragging)


         setmarkers((prevmarkers) => [...prevmarkers, [marker,EditItem]]);
       }
       else if (EditItem["type"]=="location label"){
         const locationLogoIcon = L.icon({
           iconUrl: locate,
           iconSize: [25, 25],
           iconAnchor: [25, 25],
         });
         const marker = L.marker(EditItem["coordinates"], {
           icon: locationLogoIcon,
           zIndexOffset: 2000,
           draggable: true
         }).addTo(mapInstance);
         marker.enableEdit(); 
         setmarkers((prevmarkers) => [...prevmarkers, [marker,EditItem]]);
       }
       else if (EditItem["type"]=="legend"){
         if (existlegend!=null){
           map.removeControl(existlegend);
         }
         // Check if legend is initialized
         if (EditItem["Legend Items"].length==0 || !EditItem["isCheck"]){
           setLegendItems(EditItem["Legend Items"]);
           setChecked(EditItem["isCheck"]);
           setLegendName(EditItem["legend name"]);
           return null;
         }
         // Create a new legend based on the updated legendItems
         legend = L.control({ position: 'bottomleft' });
         legend.onAdd = function () {
           var div = L.DomUtil.create('div', 'legend');
           div.innerHTML += '<h4>' + legendName + '</h4>';
           EditItem["Legend Items"].forEach(function (legendItem) {
             div.innerHTML +=
               '<i style="background: ' + legendItem.color + '"></i><span>' + legendItem.description + '</span><br>';
           });
           return div;
         };
         setLegendItems(EditItem["Legend Items"]);
         setChecked(EditItem["isCheck"]);
         setLegendName(EditItem["legend name"]);
         setLegend(legend);
         // Add the updated legend to the map
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
   return new Promise((resolve, reject) => {
     try {
       const mapInstance = L.map('edit-container').setView([0, 0], 5);
       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
       }).addTo(mapInstance);
       renderGeoJSON(mapInstance);
        mapInstance.editTools = new L.Editable(mapInstance);
       // mapInstance.addControl(drawControl);
       renderEdits(mapInstance);
       resolve(mapInstance);
     } catch (error) {
       console.error('Error loading map:', error);
       reject(error);
     }
   });
 };
  // Usage
 const initializeMap = async () => {
   try {
     const mapInstance = await loadMap();
     setMap(mapInstance);
   } catch (error) {
     // Handle the error, e.g., display an error message
     console.error('Failed to initialize map:', error);
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
                     if (feature.properties && feature.properties.name_en) {
                         console.log(feature.type);
                         console.log(feature.geometry.type);
                         console.log(feature.geometry.coordinates);
                         console.log(feature.properties.name_en);
                         layer.bindPopup(feature.properties.name_en);
                         layer.on({
                             click: (event) => {
                                 event.target.setStyle({
                                     color: "green",
                                     fillColor: "yellow",
                                 })
                             }
                         })
                     }
                    
                 },
             }).addTo(thisMap); //adds the geojason layer to the leaft map.
         thisMap.fitBounds(geojsonLayer.getBounds());
         }
         catch (error) {
             console.error('Error rendering GeoJSON:', error);
     }
   };
}
  const handleFontSelect = (selectedFont) => {
 setFontFamily(selectedFont);
 // setAnchorEl(null);
 };
 const handleFontSizeChange = (event, value) => {
 setFontSize(value);
 };
 const handleHandClick = () => {
   seteditOption('');
   }
 const handleTextFieldsClick = (event) => {
   let inputField;
   let clickedLatLng;
   const closeInputFieldOnOutsideClick = (input) => (e) => {
   if (!(input.contains(e.target) || document.activeElement === input)) {
     // Click occurred outside the input field
     input.value = '';
     input.style.display = 'none';
     document.removeEventListener('click', closeInputFieldOnOutsideClick(input));
   }
   };
   // Function to handle map click events
   const handleMapClick = (event) => {
   L.DomEvent.stopPropagation(event);
   if (event.latlng) {
     clickedLatLng = event.latlng;
     // Set the position of the input field based on the clicked LatLng
     const point = map.latLngToContainerPoint(clickedLatLng);
     inputField = document.createElement('input');
     inputField.style.left = point.x + 'px';
     inputField.style.top = point.y + 'px';
     inputField.type = 'text';
     inputField.placeholder = 'Enter text...';
     inputField.style.fontFamily = fontFamily;
     inputField.style.position = 'absolute';
     inputField.style.display = 'none'; // Initially hide the input field
     inputField.style.zIndex = '1000';
     inputField.style.backgroundColor = 'transparent';
     document.getElementById('edit-container').appendChild(inputField);
     // Handle input field keypress to create text label
     inputField.addEventListener('keypress', handleKeyPress);
     // Show the input field
     inputField.style.display = 'block';
     // Focus on the input field for the user to start typing
     inputField.focus();
     // Add a click event listener to the document
     document.addEventListener('click', closeInputFieldOnOutsideClick(inputField));
   }
   };
   if (editOption === 'addtext') {
   map.off('click');
   setAnchorEl(event.currentTarget);
   } else {
   seteditOption('addtext');
   setAnchorEl(event.currentTarget);
   }
   // Handle map click to set input field position
   map.on('click', handleMapClick);
   // Function to handle keypress events
   function handleKeyPress(event) {
     if (event.key === 'Enter') {
       const labelText = inputField.value.trim();
       if (labelText !== '') {
         const currentZoom = map.getZoom();
         // Calculate the icon size based on the current zoom level
         const iconAnchor = [10 * currentZoom, 10 * currentZoom];
         const customLabelIcon = L.divIcon({
           className: 'custom-label',
           html: `<div style="font-family: ${selectFontRef.current}; color: ${selectedColorRef.current}; font-size:${selectFontSizeRef.current}px">${labelText}</div>`,
           iconSize: [20,20],
           iconAnchor: iconAnchor,
         });
         console.log('Custom label icon:', customLabelIcon);


         // Create a marker with the custom icon and add it to the map
         const marker = L.marker(clickedLatLng, { icon: customLabelIcon }).addTo(map);
         marker.enableEdit();
         const textlabel = {"type":"text label","coordinates":clickedLatLng,"fontFamily":selectFontRef.current,"color":selectedColorRef.current,"font-size":selectFontSizeRef.current,"labelText":labelText}
         setAllChanges((prevAllChanges) => [...prevAllChanges, textlabel]);
         setHistoryIndex((prev)=>(prev+1));
         setmarkers((prevmarkers) => [...prevmarkers, [marker,textlabel]]);
         inputField.value = '';
         inputField.style.display = 'none';
       } else {
         inputField.value = '';
         inputField.style.display = 'none';
       }
     }
   }
 };
 const handleLegendClick = (event) => {
   if (editOption === 'addlegend') {
     map.off('click');
     setAnchorEl(event.currentTarget);
     } else {
     seteditOption('addlegend');
     setAnchorEl(event.currentTarget);
     }
 };


 const handleLocationOnClick = () => {
   seteditOption('locate');
   const locationLogoIcon = L.icon({
     iconUrl: locate,
     iconSize: [25, 25],
     iconAnchor: [25, 25],
   });
   console.log('Custom location icon:', locationLogoIcon);
   const handleMapClick = (event) => {
     const marker = L.marker(event.latlng, {
       icon: locationLogoIcon,
       zIndexOffset: 2000,
       draggable: true
     }).addTo(map);
     console.log("Marker info: ",marker);
     const textlabel = {"type":"location label","coordinates":event.latlng}
     setAllChanges((prevAllChanges) => [...prevAllChanges, textlabel]);
     setHistoryIndex((prev)=>(prev+1));
     setmarkers((prevmarkers) => [...prevmarkers, [marker,textlabel]]);
   };
   map.on('click', handleMapClick);
 };
  const handleColorBoxClick = () => {
   seteditOption("color");
 // Add your logic for setting fill color on a polygon here
 };
 const handleUndoClick = () => {
   if (historyIndex > 0) {
     const newHistoryIndex = historyIndex - 1;
     setHistoryIndex(newHistoryIndex);
     setAllChanges((prevEdit) => {
       const previousEdit = history[newHistoryIndex].slice();
       return previousEdit;
     });
     markers.forEach(function(marker){
       map.removeLayer(marker[0]);
       console.log("removing marker: ",marker[0]);
     });
     setmarkers((prevmarkers) => []);
     if (existlegend){
       map.removeControl(existlegend)
       setLegend(null)
     }
     setneedreload(true)
   }
 };
 const handleRedoClick = () => {
   if (historyIndex < history.length - 1) {
     const newHistoryIndex = historyIndex + 1;
     setHistoryIndex(newHistoryIndex);
     setAllChanges((prevEdit) => {
       const nextEdit = history[newHistoryIndex].slice();
       return nextEdit;
     });
     markers.forEach(function(marker){
       map.removeLayer(marker[0]);
       console.log("removing marker: ",marker[0]);
     });
     setmarkers((prevmarkers) => []);
     if (existlegend){
       map.removeControl(existlegend)
       setLegend(null)
     }
     setneedreload(true);
   }
 };
 const handleSaveClick = () => {
 // Add your logic for saving an edit here
     store.saveCustomLabel(store.currentMap._id, AllChanges)
     setAllChanges([]);
     history2.push('/');
 };
 const handleDeleteClick = () => {
   seteditOption("remove")
 // Add your logic for removing an edit here
 };


 const handleCloseButton =() =>{
   store.closeCurrentMap();
   history2.push("/");
}
 return (
 <div >
   <Box sx={{ flexGrow: 1, background: 'lightgray', alignItems: 'center', paddingLeft: '20px', margin: '1.0rem' }} id="edit-bar">
   <IconButton onClick={handleHandClick} style={{border: editOption=='' ? '2px solid black' : 'none'}}>
       <BackHandIcon />
     </IconButton>
     <IconButton onClick={handleTextFieldsClick} style={{border: editOption=='addtext' ? '2px solid black' : 'none'}}>
       <TextFieldsIcon />
     </IconButton>
     <Popover
       open={Boolean(anchorEl)&&(editOption === 'addtext')}
       anchorEl={anchorEl}
       onClose={() => setAnchorEl(null)}
       anchorOrigin={{
         vertical: 'center',
         horizontal: 'right',
       }}
       transformOrigin={{
         vertical: 'top',
         horizontal: 'left',
       }}
     >
       <Box p={2} style={{ height: '30vh', display: 'flex', flexDirection: 'column' }}>
         <Box>
           <Typography variant="h7">Select Font</Typography>
           <List style={{ maxHeight: '100px', overflowY: 'auto' }}>
             {fontOptions.map((font) => (
               <ListItem button key={font} onClick={() => handleFontSelect(font)}>
                 <ListItemText primary={font}  style={{backgroundColor: font==fontFamily ? '#ABC8B2' : 'transparent'}}/>
               </ListItem>
             ))}
           </List>
         </Box>
         <div style={{ marginTop: '10px' }}>
           <Typography variant="h7">Select Text Color</Typography>
           <input
             type="color"
             id="textColorPicker"
             value={selectedColor}
             onChange={(e) => {
               setSelectedColor(e.target.value);
               console.log('e.target.value:', e.target.value);
               console.log('selectedColor:', selectedColor);
             }}
           />
         </div>
         <Box style={{ marginTop: '10px' }}>
           <Typography variant="h7" gutterBottom>
             Select Font Size: {fontSize}
           </Typography>
           <Slider
             value={fontSize}
             onChange={handleFontSizeChange}
             aria-labelledby="font-size-slider"
             min={8}
             max={72}
             step={1}
             valueLabelDisplay="auto"
           />
         </Box>
       </Box>
     </Popover>
     <IconButton onClick={handleLegendClick} style={{border: editOption=='addlegend' ? '2px solid black' : 'none'}}>
       <LegendToggleIcon />
     </IconButton>
     <Popover
       open={Boolean(anchorEl)&&(editOption=="addlegend")}
       anchorEl={anchorEl}
       onClose={() => setAnchorEl(null)}
       anchorOrigin={{
         vertical: 'center',
         horizontal: 'right',
       }}
       transformOrigin={{
         vertical: 'top',
         horizontal: 'left',
       }}
     >
       <Box p={2} style={{ height: '30vh', display: 'flex', flexDirection: 'column' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Typography variant="body1">Show Legend</Typography>
           <Checkbox color="primary" checked={isChecked} onChange={handleCheckboxChange} />
         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Typography variant="body1">Legend Name: </Typography>
           <input
             type="text"
             value={legendName}
             onChange={handleLegendNameChange}
             placeholder="Enter Legend Name"
           />
         </div>
         {/* Display current legends */}
     
         <div>
           <Typography variant="h6">Current Legends:</Typography>
           <div>
             {legendItems.map((legendItem, index) => (
               <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                 <span style={{ backgroundColor: legendItem.color, padding: '4px', marginRight: '8px', borderRadius: '50%' }}></span>
                 <Typography variant="body1">{legendItem.description}</Typography>
                 <Button onClick={() => handleRemoveLegendClick(index)} style={{ marginLeft: 'auto' }}>Remove</Button>
               </div>
             ))}
           </div>
         </div>
         {/* Button to insert a new legend */}
         <Button onClick={handleInsertLegendClick}>Insert Legend</Button>
       </Box>
     </Popover>
     <Dialog open={isModalOpen} onClose={handleModalClose}>
       <DialogTitle>Insert Legend</DialogTitle>
       <DialogContent>
       <Typography variant="body1">Select Legend Color: </Typography>
           <input
             type="color"
             value={legendColor}
             onChange={handleColorChange}
             style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
           />
         <TextField
           label="Legend Description"
           fullWidth
           value={LegendDescription}
           onChange={(event) => handleLegendDescriptionChange(event)}
         />
       </DialogContent>
       <DialogActions>
         <Button onClick={handleModalClose}>Cancel</Button>
         <Button onClick={handleDoneClick}>Done</Button>
       </DialogActions>
     </Dialog>
     <IconButton onClick={handleLocationOnClick}style={{border: editOption=='locate' ? '2px solid black' : 'none'}}>
       <LocationOnIcon />
     </IconButton>
     <IconButton style={{border: editOption=='color' ? '2px solid black' : 'none'}} onClick={handleColorBoxClick}>
     <ColorLensIcon/>
     </IconButton>
     <IconButton onClick={handleUndoClick}>
       <UndoIcon/>
     </IconButton>
     <IconButton  onClick={handleRedoClick}>
     <RedoIcon/>
     </IconButton>
     <IconButton onClick={handleSaveClick}>
       <SaveIcon />
     </IconButton>
     <IconButton onClick={handleDeleteClick} style={{border: editOption=='remove' ? '2px solid black' : 'none'}}>
       <DeleteIcon />
     </IconButton>
   </Box>
   <div id="map-name-edit">
     {store.currentMap.name}
   </div>
   <Box id="export-close-edit">
   <IconButton>
           <ExitToAppIcon style={{fontSize: '1.5rem'}}></ExitToAppIcon>
       </IconButton>
     {/* <CloseIcon onClick={handleCloseButton}></CloseIcon> */}
     <IconButton onClick={handleCloseButton}><CloseIcon style={{fontSize: '1.5rem'}}>
       </CloseIcon>
       </IconButton>
   </Box>
   <div id="edit-container"></div>
 </div>
 );
};
export default EditScreen;


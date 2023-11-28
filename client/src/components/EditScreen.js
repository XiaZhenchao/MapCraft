import React, { useContext, useEffect, useState, useRef } from 'react';
import { GlobalStoreContext } from '../store';
import AppBanner from './AppBanner';
import BackHandIcon from '@mui/icons-material/BackHand';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw/dist/leaflet.draw';
import 'leaflet-editable';
import TextField from '@mui/material/TextField';
import { Slider, IconButton, Button, Box, Popover, List, ListItem, ListItemText, Typography } from '@mui/material';




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




const EditScreen = () => {
const { store } = useContext(GlobalStoreContext);
let appBanner = <AppBanner />;
const [map, setMap] = useState(null);
const [editOption, seteditOption] = useState('');
const [fontFamily, setFontFamily] = useState('Arial');
const [anchorEl, setAnchorEl] = useState(null);
const [selectedColor, setSelectedColor] = useState('#000000');
const [fontSize, setFontSize] = useState(16);
let drawControl;




useEffect(() => {
// Load the map when the component mounts
loadMap();
}, []); // The empty dependency array ensures it runs once on mount
const selectedColorRef = useRef(selectedColor);
const selectFontSizeRef = useRef(fontSize);
const selectFontRef = useRef(fontFamily);




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
}, [editOption, map]);




const loadMap = () => {
try {
  const mapInstance = L.map('edit-container').setView([0, 0], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=" ">OpenStreetMap</a > contributors',
  }).addTo(mapInstance);
  var drawnItems = new L.FeatureGroup();
  mapInstance.addLayer(drawnItems);
  drawControl = new L.Control.Draw({
    draw: {
      polygon: true,
      rectangle: true,
      circle: true,
      marker: true,
      polyline: {
        shapeOptions: {
          color: 'blue',
        },
      },
    },
    edit: {
      featureGroup: drawnItems,
      remove: true,
    },
  });
  mapInstance.editTools = new L.Editable(mapInstance);
  mapInstance.addControl(drawControl);
  mapInstance.on('draw:created', function (e) {
    var layer = e.layer;
    drawnItems.addLayer(layer);
  });
  setMap(mapInstance);
} catch (error) {
  console.error('Error loading map:', error);
}
};
































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




    // Clear the input field and hide it
    inputField.value = '';
    inputField.style.display = 'none';
  } else {
    inputField.value = '';
    inputField.style.display = 'none';
  }
}
}




};








const handleLocationOnClick = () => {
// Add your logic for adding markers here
};
















const handleLineBoxClick = () => {
// Trigger the draw control for polyline
drawControl.setDrawingOptions({ polyline: {} });
drawControl.startPolyline();
};
















const handleColorBoxClick = () => {
// Add your logic for setting fill color on a polygon here
};
















const handleUndoClick = () => {
// Add your logic for undoing an edit here
};
















const handleRedoClick = () => {
// Add your logic for redoing an edit here
};
















const handleSaveClick = () => {
// Add your logic for saving an edit here
};
















const handleDeleteClick = () => {
// Add your logic for removing an edit here
};
















return (
<div style={{ display: 'flex', height: '100vh' }}>
  <Box sx={{ flexGrow: 1, background: 'lightgray', alignItems: 'center', paddingLeft: '20px', margin: '1.0rem' }} id="edit-bar">
  <IconButton onClick={handleHandClick} style={{border: editOption=='' ? '2px solid black' : 'none'}}>
      <BackHandIcon />
    </IconButton>
    <IconButton onClick={handleTextFieldsClick} style={{border: editOption=='addtext' ? '2px solid black' : 'none'}}>
      <TextFieldsIcon />
    </IconButton>
    <Popover
      open={Boolean(anchorEl)}
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




    <IconButton onClick={handleLocationOnClick}>
      <LocationOnIcon />
    </IconButton>
    <IconButton sx={{ margin: '1.0rem' }} onClick={handleLineBoxClick}>
      <Button id="line-box"></Button>
    </IconButton>
    <IconButton sx={{ margin: '0.3rem' }} onClick={handleColorBoxClick}>
      <Button id="color-box"></Button>
    </IconButton>
    <IconButton sx={{ fontSize: '2rem', color: 'black' }} onClick={handleUndoClick}>
      ⟳
    </IconButton>
    <IconButton sx={{ fontSize: '2rem', color: 'black' }} onClick={handleRedoClick}>
      ⟲
    </IconButton>
    <IconButton onClick={handleSaveClick}>
      <SaveIcon />
    </IconButton>
    <IconButton onClick={handleDeleteClick}>
      <DeleteIcon />
    </IconButton>
  </Box>
  <div id="map-name-another">
    Map1 <IconButton><EditIcon /></IconButton>
  </div>
  <Box id="export-close">
    <ExitToAppIcon />
    <CloseIcon />
  </Box>
  <div id="edit-container"></div>
</div>
);
};


export default EditScreen;





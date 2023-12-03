import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MapTemplateModal = ({ open, handleClose, onConfirm }) => {
  // store the type of map
  const [mapType, setMapType] = useState('');
  // store the mapFile
  const [selectedFile, setSelectedFile] = useState(false);

  const handleMapTypeChange = (event) => {
    setMapType(event.target.value);
  };

  const handleFileInputChange = () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    setSelectedFile(file);
  };

  const handleSelectFileClick = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click(); // Trigger the file input click
  };

  const handleConfirmClick = () => {
    if (mapType && selectedFile) {
        // Pass both selected file and map type back to the HomeScreen component
        onConfirm({ file: selectedFile, mapType });
        handleClose();
      } else {
        // Show an alert if the condition is not met
        alert('Please select a map type and choose a file before confirming.');
      }
  };

  const handleCancelClick = () => {
    // Pass both selected file and map type back to the HomeScreen component
    handleClose()
  };

  const handleUnselectFile = () => {
    // Pass both selected file and map type back to the HomeScreen component
    setSelectedFile(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 470,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <Alert severity="info">
          <AlertTitle>Select Map Type</AlertTitle>
          <label>
            <input
              type="radio"
              name="mapType"
              value="dotDensityMap"
              checked={mapType === 'dotDensityMap'}
              onChange={handleMapTypeChange}
            />
            Dot Density Map
          </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            name="mapType"
            value="symbolMap"
            checked={mapType === 'symbolMap'}
            onChange={handleMapTypeChange}
          />
          Symbol Map
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            name="mapType"
            value="choroplethMap"
            checked={mapType === 'choroplethMap'}
            onChange={handleMapTypeChange}
          />
          Choropleth Map
        </label>
        <label>
          <input
            type="radio"
            name="mapType"
            value="heatMap"
            checked={mapType === 'heatMap'}
            onChange={handleMapTypeChange}
          />
          Heat Map
        </label>
        <label style={{ marginLeft: '30px' }}>
          <input
            type="radio"
            name="mapType"
            value="flowMap"
            checked={mapType === 'flowMap'}
            onChange={handleMapTypeChange}
          />
          Flow Map
        </label>
        <br></br>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
          <br />
        <label class="drop-container" >
        <span class="drop-title">Drop files here</span>
        or
        <Button onClick={handleSelectFileClick}>Select File</Button>
        <br />
        </label>
        {selectedFile!=null && (
        <div>
            <p>Selected File: {selectedFile.name} <IconButton  onClick={handleUnselectFile}><CloseIcon></CloseIcon></IconButton></p >
        </div>
        )}
        <br />
        <Button onClick={handleConfirmClick}>Confirm</Button>
        <Button style={{  marginLeft: '180px' }} onClick={handleCancelClick}>Cancel</Button>
        </Alert>
      </Box>
    </Modal>
  );
};

export default MapTemplateModal;

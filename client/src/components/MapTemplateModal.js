import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
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
        <label>
          <input
            type="radio"
            name="mapType"
            value="symbolMap"
            checked={mapType === 'symbolMap'}
            onChange={handleMapTypeChange}
          />
          Symbol Map
        </label>
        <label>
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
        <label>
          <input
            type="radio"
            name="mapType"
            value="flowMap"
            checked={mapType === 'flowMap'}
            onChange={handleMapTypeChange}
          />
          Flow Map
        </label>
        <input
          type="file"
          id="fileInput"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
        <br />
        <Button onClick={handleSelectFileClick}>Select File</Button>
        <br />
        {selectedFile!=null && (
                    <div>
                        <p>Selected File: {selectedFile.name}</p >
                    </div>
                )}
        <Button onClick={handleConfirmClick}>Confirm</Button>
        <Button onClick={handleCancelClick}>Cancel</Button>
        </Alert>
      </Box>
    </Modal>
  );
};

export default MapTemplateModal;

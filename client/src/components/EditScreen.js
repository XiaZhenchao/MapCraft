import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const EditScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    let appBanner = <AppBanner />

    
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
          <div style={{ flex: 1, padding: '20px' }}>
               {'aaaaaaa'}
          </div>

      {/* Vertical Bar */}
      <div
        style={{
          width: '1px',
          background: '#ccc', // Set the color of the vertical bar
        }}
      />
        
        </div>)
}


export default EditScreen;
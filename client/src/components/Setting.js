import { useContext } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ValueControl from './ValueControl';
import { useHistory } from 'react-router-dom';
export default function Setting() {
    const { auth } = useContext(AuthContext);
    const history = useHistory();
    const handleSaveButton = () => {
         history.goBack()
    }
    return (
        <div>
            <Box id = "setting-box"> </Box>
            <Grid >
                <Box
                    sx={{
                        my: 13,
                        mx: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        fontSize: '3rem',
                    
                    }}
                >Setting
                    
                    <div style={{ display: 'flex', width: '90%',fontSize: '1.5rem' ,padding:'25px', paddingLeft:'20%'}}>
                        <Box className = 'element-with-stroke' style={{backgroundColor: 'lightgray'}}>System Font Size</Box>
                        <ValueControl/>
                    </div>
                    <div style={{ display: 'flex', width: '90%',fontSize: '1.5rem' ,padding:'25px', paddingLeft:'20%'}}>
                        <Box className = 'element-with-stroke' style={{backgroundColor: 'lightgray'}}>System Language</Box>
                        <Box className = 'element-with-stroke' style={{marginLeft:'105px',backgroundColor: 'lightgray'}}>English<Button id = 'selection-button' ></Button></Box>
                    </div>
                    <div style={{ display: 'flex', width: '90%',fontSize: '1.5rem' ,padding:'25px', paddingLeft:'20%'}}>
                        <Box className = 'element-with-stroke' style={{backgroundColor: 'lightgray'}}>Map Font Size</Box>
                        <ValueControl/>
                    </div>
                    <div style={{ display: 'flex', width: '90%',fontSize: '1.5rem' ,padding:'25px', paddingLeft:'20%'}}>
                        <Box className = 'element-with-stroke' style={{backgroundColor: 'lightgray'}}>Map Language</Box>
                        <Box className = 'element-with-stroke' style={{marginLeft:'130px',backgroundColor: 'lightgray'}}>English<Button id = 'selection-button' ></Button></Box>
                    </div>
                    <Button id = "saveButton"
                   onClick={handleSaveButton}>Save</Button>
                    <Copyright sx={{ my: 2 }} />
                </Box>
               
            </Grid>
            
               
        </div>
        
        
    );
}
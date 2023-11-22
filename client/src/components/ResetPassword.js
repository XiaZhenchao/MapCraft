import { useContext } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios'; 

export default function ResetPassword() {
    const { auth } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState('');
    const [verifyNewPassword, setVerifyNewPassword] = useState('');

    const handleSubmitNewPasswordButton = async (event) => {
        event.preventDefault();
        console.log("handleSubmitNewPasswordButton clicked");
        console.log("newPassword: " + newPassword);
        console.log("verifyNewPassword: " + verifyNewPassword);
    };
    
    return (
        <div>
            <Box id = "reset-box"> </Box>
            <Grid item xs={12} sm={8} md={5} elevation={6} square>
                <Box
                    sx={{
                        my: 20,
                        mx: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <TextField
                            style={{
                                width: '60%', 
                                margin: '1.0rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                            }}
                            required
                            name="Reset Your New Password"
                            label="Reset Your New Password"
                            type="Reset Your New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                           
                        />
                    <TextField
                            style={{
                                width: '60%', 
                                margin: '1.0rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                            }}
                            required
                            name="Confirm Your New Password"
                            label="Confirm Your New Password"
                            type="Confirm Your New Password"
                            onChange={(e) => setVerifyNewPassword(e.target.value)}
                            
                            
                        />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
            <Button
              type="submit"
              id = "SubmitNewPasswordButton"
              variant="contained"
              sx={{ borderRadius: '20px', mt: 3, mb: 2, color: 'black', backgroundColor: '#e1e4cb', flex: 1, marginRight: '0.5rem' 
            }} onClick={handleSubmitNewPasswordButton}
            >
              Submit
            </Button>
            
          </div>
          <Copyright sx={{ mt: 5 }} />
                </Box>
               
            </Grid>
            
               
        </div>
        
        
    );
}
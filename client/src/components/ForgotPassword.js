import { useContext } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
export default function ForgotPassword() {
    const { auth } = useContext(AuthContext);
    
    
    return (
        <div>
            <Box id = "reset-box"> </Box>
            <Grid item xs={12} sm={8} md={5} elevation={6} square>
                <Box
                    sx={{
                        my: 30,
                        mx: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <TextField
                            style={{
                                width: '50%', 
                                margin: '0.4rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb'
                            }}
                            required
                            name="Input Email Address"
                            label="Input Email Address"
                            type="Input Email Address"
                            
                        />
                        <Button style={{ color: 'Black', backgroundColor: '#e1e4cb', margin: '3.0rem' }}>Send Code</Button>
                </Box>
            </Grid>
        </div>
        
        
    );
}
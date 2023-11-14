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
                                margin: '0.4rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                            }}
                            required
                            name="Input Email Address"
                            label="Input Email Address"
                            type="Input Email Address"
                            
                        />
                    <TextField
                            style={{
                                width: '60%', 
                                margin: '0.4rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb',
                                borderRadius: '20px'
                            }}
                            required
                            name="Input Verification Code"
                            label="Input Verification Code"
                            type="Input  Verification Code"
                            
                            
                        />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: '20px', mt: 3, mb: 2, backgroundColor: '#e1e4cb', flex: 1, marginRight: '0.5rem' }}
            >
              Verify Code
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: '20px', mt: 3, mb: 2, backgroundColor: '#e1e4cb', flex: 1, marginLeft: '0.5rem' }}
            >
              Send me a password reset link
            </Button>
          </div>
                </Box>
            </Grid>
        </div>
        
        
    );
}
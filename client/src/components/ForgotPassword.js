import { useContext } from 'react';
import AuthContext from '../auth'

import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MUILoginErrorModal from './MUILoginErrorModal';

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
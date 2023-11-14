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
import { useContext } from 'react';
import AuthContext from '../auth'

import Copyright from './Copyright'
import axios from 'axios'; 
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MUILoginErrorModal from './MUILoginErrorModal';
import ForgotPassword from './ForgotPassword';
export default function LoginScreen() {
    const { auth } = useContext(AuthContext);

    let modalJSX = "";
    
    if (auth.isLoginModalOpen()) {
        modalJSX = <MUILoginErrorModal />;
    }

    
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.loginUser(
            formData.get('email'),
            formData.get('password')
        );

    };
    // const handleSubmit = async (event) => {
    //     console.log("submit!@");
    //     event.preventDefault();
    //     const formData = new FormData(event.currentTarget);
    //     try {
    //         const response = await axios.post('/auth/login', {
    //             email: formData.get('email'), // Corrected property name
    //             password: formData.get('password') // Corrected property name
    //         });
    
    //         // Handle the response here
    //         console.log(response.data); // Example: Log the response data
    
    //         // If the login is successful, you might want to update the authentication context
    //         // auth.loginUser(formData.get('email'), formData.get('password'));
    //     } catch (error) {
    //         console.error('Error:', error);
    //         // Handle errors here
    //     }
    // };
    



    return (
        <Grid >
            <CssBaseline />
            
            <Grid item xs={12} sm={8} md={5} elevation={6} square>
                <Box id = "login-box"> </Box>
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
                    <Box component="form" noValidate onSubmit={handleSubmit} 
                    sx={{ mt: 1, alignItems: 'center', justifyContent: 'center'}}>
                    
                        <TextField style={{
                                width: '100%', 
                                margin: '1.0rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                            }}
                            margin="normal"  
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField style={{
                                width: '100%', 
                                margin: '1.0rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                            }}
                            margin="normal"
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Grid container justifyContent="center" alignItems="center">
                            <Button 
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2, color: 'black', backgroundColor: '#e1e4cb'}}
                            >
                            Sign In
                            </Button>
                        </Grid>
                        
                        <Grid container justifyContent="center" alignItems="center">
                             <Link to = "/forgot-password" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>  
                        <Grid container justifyContent="center" alignItems="center">
                            <Link Link to='/register/' variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                            
                                
                            
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                    </Box>
                </Grid>
            </Grid>
            { modalJSX }
        </Grid>
    );
}
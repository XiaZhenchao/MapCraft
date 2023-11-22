import { useContext } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useState } from 'react';


export default function ForgotPassword() {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    // var transporter = nodeMailer.createTransport({
    //     server: 'gmail',
    //     port:465,
    //     auth: {
    //         user: 'mapcraftoffical@gmail.com',
    //         pass: 'SBUcse416!'
    //     }
    // });


    const handleVerifyCodeButton = (event) =>{
        console.log("handleVerifyCodeButton clicked");
    }

    const handleSendLinkButton = (event) =>{
        event.preventDefault();
        console.log("handleSendLinkButton clicked");
        console.log("email: "+ email);
        // var mailOptions = {
        //     from: 'MapCraftTeam <mapcraftoffical@gmail.com>',
        //     to: email,
        //     subject: 'this is resend link',
        //     text: 'please click the link to reset your password'
        // }

        // transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });
    }
    
    
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
                            name="EmailAddress"
                            label="Input Email Address"
                            type="Input Email Address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    <TextField
                            style={{
                                width: '60%', 
                                margin: '1.0rem auto', // Center the TextField using margin
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                            }}
                            required
                            name="Input Verification Code"
                            label="Input Verification Code"
                            type="Input  Verification Code"
                            
                            
                        />
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
            <Button
              type="submit"
              id = "VerifyCodeButton"
              variant="contained"
              sx={{ borderRadius: '20px', mt: 3, mb: 2, color: 'black', backgroundColor: '#e1e4cb', flex: 1, marginRight: '0.5rem' 
            }} onClick={handleVerifyCodeButton}
            >
              Verify Code
            </Button>
            <Button
              type="submit"
              id = "SendLinkButton"
              variant="contained"
              sx={{ borderRadius: '20px', mt: 3, mb: 2, color: 'black', backgroundColor: '#e1e4cb', flex: 1, marginLeft: '0.5rem' }}
              onClick={handleSendLinkButton}
            >
              Send me a password reset link
            </Button>
            
          </div>
          <Copyright sx={{ mt: 5 }} />
                </Box>
               
            </Grid>
            
               
        </div>
        
        
    );
}
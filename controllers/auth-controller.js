const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer');
const crypto = require('crypto');
getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
       
        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                email: existingUser.email              
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        console.log("create user: " + firstName + " " + lastName + " " + email + " " + password + " " + passwordVerify);
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);
        console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,  
                email: savedUser.email              
            }
        })

        console.log("token sent");

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


forgotPassword = async (req, res) => {
    console.log("forgotPassword111");
    try {
        const { email } = req.body;
        console.log("forgotPassword777")
        console.log("email: "+ email)
        console.log("forgotPassword888")
        if (!email) {
            console.log("forgotPassword999")
            return res
                .status(400)
                .json({ errorMessage: "Please provide your email address." });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            console.log("forgotPassword101010")
            return res
                .status(404)
                .json({
                    errorMessage: "User with this email address does not exist."
                })
        }

        // GENERATE RESET TOKEN
        const resetToken = crypto.randomBytes(20).toString('hex'); // Generate a unique reset token
        existingUser.resetPasswordToken = resetToken; // Store token in user document
        existingUser.resetPasswordExpires = Date.now() + 3600000; // Token expiration time (1 hour)

        // SAVE USER WITH RESET TOKEN INFO
        await existingUser.save();

        const resetLink = `https://mapcraft-55160ee4aae1.herokuapp.com/reset-password?token=${resetToken}`;
        // SEND PASSWORD RESET EMAIL
        var transporter = nodeMailer.createTransport({
            service:'gmail',
            port:465,
            secure: true,
            logger:true,
            debug: true,
            secureConnection: false,
            auth: {
                user: 'dr.huanian@gmail.com',
                pass: 'wmhj yexy ttgj zinj'
            },
            tls:{
                rejectUnAuthorized: true
            }
        });
        var mailOptions = {
            from: 'MapCraftTeam <dr.huanian@gmail.com>',
            to: email,
            subject: 'this is resend link',
            text: `Click the link to reset your password: ${resetLink}`
        }

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                return res.status(500).json({ errorMessage: "Failed to send reset email." });
            } else {
                console.log('Password reset email sent: ' + info.response);
                return res.status(200).json({
                    success: true,
                    message: 'Password reset instructions sent to your email.'
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: "Internal server error." });
    }
}

resetPassword = async (req, res) => {
    console.log("resetPassword in auth controller1")
    console.log("Request body: ", req.body)
    try {
        const { resetToken, newPassword, verifyNewPassword } = req.body;
        console.log("resetToken: "+ resetToken);
        console.log("newPassword: "+ newPassword);
        console.log("confirmPassword: "+ verifyNewPassword);
        console.log("resetPassword in auth controller2")
        if (!newPassword || !verifyNewPassword) {
            console.log("resetPassword in auth controller3")
            return res.status(400).json({ errorMessage: "Please enter all required fields." });
        }

        if (newPassword !== verifyNewPassword) {
            console.log("resetPassword in auth controller4")
            return res.status(400).json({ errorMessage: "Passwords do not match." });
        }

        const user = await User.findOne({ 
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });
        console.log("resetPassword in auth controller5");
        if (!user) {
            console.log("resetPassword in auth controller6");
            return res.status(400).json({ errorMessage: "Invalid or expired password reset token." });
        }

        // Hash new password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update user with new password
        user.passwordHash = passwordHash;
        user.resetPasswordToken = undefined; // Clear reset token
        user.resetPasswordExpires = undefined; // Clear token expiry

        await user.save();
        console.log("resetPassword in auth controller7");
        res.status(200).json({ success: true, message: "Password successfully reset." });
    } catch (err) {
        console.error(err);
        res.status(500).send({ errorMessage: "Internal server error." });
    }
}



module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
}
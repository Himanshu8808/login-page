const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const fetchuser = require('../middleware/fetchuser');

//secret code for jason web token
const JWT_SECRET = process.env.JWT_SECRET;

//ROUTE 1 creating a new user: No login required

router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
], async (req, res) => {
    let Success = false;

    // cheking validation result

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Success, errors: errors.array() });
    }

    // Check if a user is already exist or not

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ Success, error: 'Sorry a user with this email already exist' });
        }

        // creating a hashed password

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Creating a genuine new user  

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        //signing json web token for sending to the user

        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECRET);
        Success = true;
        res.json({ Success, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

//ROUTE 2 creating endpoint for login validation: No login required

router.post('/login', [
    body('email').isEmail(),
    body('password').exists(),
], async (req, res) => {
    let Success = false;
    const errors = validationResult(req);

    // cheking validation result

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {

        //search wether the user exist or not

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ Success, error: 'Please enter correct credentials' });
        }

        // comparing entered and stored hashed password

        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            Success = false;
            return res.status(400).json({ Success, error: 'Please enter correct credentials' });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECRET);
        Success = true;
        res.json({ Success, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

//ROUTE 3 get loggedin user details using post: "/api/auth/getuser" .Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

//ROUTE 4 forgot password handling
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    let Success = false;

    function generateOTP() {
        // 1. Generate a random number between 0 and 9999 (inclusive)
        const randomNum = Math.floor(Math.random() * 10000);

        // 2. Ensure the number is always 4 digits by adding 1000 if necessary
        const otp = randomNum.toString().padStart(4, '0');

        return otp;
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({Success, message: 'Email not found' });
        }

        let OTP = generateOTP();

        // Setting up the otp related to the user
        user.otp = OTP;

        // user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: 'sophie.connelly@ethereal.email',
                pass: 'wT2wQ4x2wZkPXrD6TY'
            },
        });
        let info = await transporter.sendMail({
            from: '"Login-Page" <dixitbrothers601@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Forgot Password OTP", // Subject line
            text: OTP, // plain text body
        });

        Success = true
        res.json({Success, message: "OTP Sent"});

    }
    catch (error) {
        res.status(500).send("internal server error")
    }
});

//ROUTE 5 reset password in the database

router.put('/reset-password', async (req, res) => {
    const { newPassword, otp } = req.body;
    let Success = false;

    try {
        const user = await User.findOne({
            otp,
            // resetTokenExpiration: { $gt: Date.now() } // Check for unexpired token
        });
        if (!user) {
            return res.status(400).json({ Success, message: 'Invalid or expired OTP' });
        }

        // creating a hashed password

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(newPassword, salt);

        user.password = secPass; // Hashed new password
        user.otp = undefined;
        // user.resetTokenExpiration = undefined;
        await user.save();
        Success = true;
        res.status(200).json({ Success, message: 'Password reset Successfully'});
    }
    catch (error) {
        res.send("internal server error")
    }
})

module.exports = router;
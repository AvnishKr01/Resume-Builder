const User = require("../model/User-Model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register User
const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        //Generate token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res
            .status(201)
            .json({
                success: true,
                token,
                newUser: {
                    name: newUser.name,
                    email: newUser.email,
                    id: newUser._id
                }
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "Error in Registering user", error: error.message });
    }
}

// Login User
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Check if user exists
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({success: false, message: "User does not exist"});
        }
        
        //Check if password is correct
        const isMatch = await user.comparedPassword(password);
        if(!isMatch){
            return res.status(400).json({success: false, message: "Invalid Credentials"});
        }   

        //Generate token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        res.status(200).json({
            success: true,
            token,
            user:{
                name: user.name,
                email: user.email,
                id: user._id        
            }
        })

    } catch (error) {
        res.status(500).json({success: false, message: "Error in Logging in", error: error.message});
    }
}

// GetUser Profile
const GetUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
        return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });

    } catch (error) {
        res.status(500).json({success: false, message: "Error in fetching user profile", error: error.message});
    }
}

module.exports = { Register, Login, GetUserProfile };
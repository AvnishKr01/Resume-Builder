const e = require("express");
const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    title:{
        type: String,
        required: true
    },
    thumbnailLink:{
        type: String,
    },
    template:{
        theme:String,
        colorPalette: [String]
    },
    ProfileInfo:{
        profilePreviewurl: String,
        fullName: String,
        designation: String,
        summary: String,
    },
    contactInfo:{
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
        website: String 
    },
    // workExp: Array of objects
    workExperience: [
        {
            company: String,
            role: String,
            startDate: String,
            endDate: String,
        }
    ],
    education: [
        {
            degree: String,
            institution: String,
            startDate: String,
            endDate: String,
        }
    ],
    skills:[
        {
            name: String,
            progress: Number,
        }
    ],
    projects:[
        {
            title: String,
            description: String,
            github: String,
            liveDemo: String
        }
    ],
    certifications:[
        {
            title: String,
            issuer: String,
            year: String,
        }
    ],
    languages:[
        {
            name: String,
            progress: Number,
        }
    ],
    interests:[String]
},
{ timestamps: {createdAt:"createdAt", updatedAt:"updatedAt"} });  

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
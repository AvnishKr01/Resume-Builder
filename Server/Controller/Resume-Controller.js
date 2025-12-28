const Resume = require("../model/Resume-Model");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Create or Update Resume
const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        // Default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user.id,
            title,
            ...defaultResumeData,
            ...req.body
        });

        res.status(201).json({ success: true, message: "Resume created successfully", resume: newResume });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in creating resume", error: error.message });
    }
}


// Get Function to get all resumes of a user

// const getResumes = async (req, res) => {
//     try {
//         const resumes = await Resume.find({userId: req.user._id}).sort({upadatedAt: -1});
//         res.status(200).json({success: true, resumes});
//     } catch (error) {
//         res.status(500).json({success: false, message: "Error in fetching resumes", error: error.message});
//     }
// }

const getResumes = async (req, res) => {
    try {
        // console.log("Decoded user:", req.user); // ✅ Check this

        const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });

        res.status(200).json({ success: true, resumes });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in fetching resumes",
            error: error.message,
        });
    }
};


// Get single resume by id
const getResumeById = async (req, res) => {
    try {
        console.log("Decoded user:", req.user);
        console.log("Resume ID:", req.params.id);
        // Ensure valid ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid Resume ID" });
        }

        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user.id, // match your authMiddleware field
        });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Resume fetched successfully",
            data: resume,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in fetching resume", error: error.message });
    }
}

// Update Resume
const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        //Merge updates resume
        Object.assign(resume, req.body);
        //Save resume
        const savedResume = await resume.save();
        res.status(200).json({ success: true, message: "Resume updated successfully", resume: savedResume });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error in updating resume", error: error.message });
    }
}

// Delete Resume
// const deleteResume = async (req, res) => {
//     try {

//         console.log("Decoded user:", req.user);
//         console.log("Resume ID:", req.params.id);
//         // Delete the resume belonging to this user
//         // const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
//         const resume = await Resume.findByIdAndDelete(req.params.id);
//         if (!resume) {
//             return res.status(404).json({ success: false, message: "Resume not found" });
//         }

//         // Create a backup of the deleted resume
//         const backupDir = path.join(process.cwd(), 'upload');

//         // Delete Thumbnail Function
//         if (resume.thumbnailLink) {
//             const oldThumbnail = path.join(backupDir, path.basename(resume.thumbnailLink));
//             if (fs.existsSync(oldThumbnail)) {
//                 fs.unlinkSync(oldThumbnail);
//             }
//         }
//         if (resume.profileInfo) {
//             const oldProfileImg = path.join(backupDir, path.basename(resume.profileInfo.previewUrl));
//             if (fs.existsSync(oldProfileImg)) {
//                 fs.unlinkSync(oldProfileImg);
//             }
//         }

//         // Delete Resume Doc
//         const deleted = await Resume.findByIdAndDelete({ _id: req.params.id, userId: req.user._id });
//         if (!deleted) {
//             return res.status(404).json({ success: false, message: "Resume not found" });
//         }
//         res.status(200).json({ success: true, message: "Resume deleted successfully", resume: deleted });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error in deleting resume", error: error.message });
//     }
// }

const deleteResume = async (req, res) => {
    try {
        console.log("Decoded user:", req.user);
        console.log("Resume ID:", req.params.id);

        // Ensure valid ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid Resume ID" });
        }

        // Find and delete only if it belongs to this user
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id, // match your authMiddleware field
        });

        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }

        // Backup directory
        const backupDir = path.join(process.cwd(), "upload");

        // Delete thumbnail
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(backupDir, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        // Delete profile image
        if (resume.profileInfo?.previewUrl) {
            const oldProfileImg = path.join(backupDir, path.basename(resume.profileInfo.previewUrl));
            if (fs.existsSync(oldProfileImg)) {
                fs.unlinkSync(oldProfileImg);
            }
        }

        res.status(200).json({ success: true, message: "Resume deleted successfully", resume });
    } catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({
            success: false,
            message: "Error in deleting resume",
            error: error.message,
        });
    }
};


module.exports = { createResume, getResumes, getResumeById, updateResume, deleteResume };
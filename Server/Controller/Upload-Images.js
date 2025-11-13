const fs = require("fs");
const path = require("path");
const Resume = require("../model/Resume-Model");
const upload = require("../middleware/Upload-middleware");

const uploadProfileImage = (req, res) => {
    // Use multer middleware
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "profileImage", maxCount: 1 }
    ])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        try {
            // console.log("FILES:", req.files);

            const resumeId = req.params.id;
            const resume = await Resume.findOne({ _id: resumeId, userId: req.user.id });
            if (!resume) {
                return res.status(404).json({ success: false, message: "Resume not found" });
            }

            const uploadDir = path.join(process.cwd(), "upload");
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const newThumbnail = req.files?.thumbnail?.[0];
            const newProfileImage = req.files?.profileImage?.[0];

            // Ensure profileInfo object exists
            if (!resume.profileInfo) {
                resume.profileInfo = {
                    profileImg: "",
                    previewUrl: "",
                    fullName: "",
                    designation: "",
                    summary: "",
                };
            }

            // 🔹 Handle Thumbnail
            if (newThumbnail) {
                if (resume.thumbnailLink) {
                    const oldFileName = path.basename(resume.thumbnailLink);
                    const oldThumbPath = path.join(uploadDir, oldFileName);

                    // ✅ Only delete if a valid filename exists and file actually exists
                    if (oldFileName && fs.existsSync(oldThumbPath) && fs.lstatSync(oldThumbPath).isFile()) {
                        fs.unlinkSync(oldThumbPath);
                    }
                }

                resume.thumbnailLink = `${baseUrl}/upload/${newThumbnail.filename}`;
            }


            // 🔹 Handle Profile Image
            if (newProfileImage) {
                const oldProfileFile = path.basename(resume.profileInfo.profileImg || "");
                const oldProfilePath = path.join(uploadDir, oldProfileFile);

                if (oldProfileFile && fs.existsSync(oldProfilePath) && fs.lstatSync(oldProfilePath).isFile()) {
                    fs.unlinkSync(oldProfilePath);
                }

                resume.profileInfo.profileImg = `${baseUrl}/upload/${newProfileImage.filename}`;
                resume.profileInfo.previewUrl = `${baseUrl}/upload/${newProfileImage.filename}`;
            }


            await resume.save();

            res.status(200).json({
                success: true,
                message: "Image(s) uploaded successfully",
                thumbnail: resume.thumbnailLink,
                profileImage: resume.profileInfo.profileImg,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error uploading image",
                error: error.message,
            });
        }
    });
};

module.exports = { uploadProfileImage };


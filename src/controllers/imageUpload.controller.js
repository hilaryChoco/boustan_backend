const { uploadImage } = require('../helper/imageUpload');


exports.uploadImage = async(req, res) => {
    try {
        const myFile = req.file;
        const imageUrl = await uploadImage(myFile);
        return res.status(200).json({
            type: "success",
            message: "Upload was successful",
            data: imageUrl
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: 'Internal server error!',
            error: error.stack,
        });
    }
}
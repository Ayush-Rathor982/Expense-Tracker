const DownloadedFiles = require('../models/downloadedFiles')


const getDownloadedList = async (req,res,next) => {
    try {       

        const userId = req.user.id
        // const userId = 1

        const downloadedFiles = await DownloadedFiles.findAll({
            where : {
                UserId : userId
            }
        });


        if(downloadedFiles.length === 0){
             return res.status(404).send("expense not found");
        }

        return res.status(200).json({
            success: true,
            downloadedFiles
        });

    } catch (error) {
        res.status(500).send("Error while fetching ",error.message);
    }
}

module.exports = {
    getDownloadedList
}
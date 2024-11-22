
const { body, validationResult } = require('express-validator');
const {convertToMp3 } = require("../../utils/youtube.util")
const {transcribeFile} = require("../../utils/assemblyai.util")
const { createGuidImage } = require("../../utils/generateimage.util");
const { createVideo } = require("../../utils/db.util")


exports.list = async (req, res, next) => {
    try {
     var url =  await createGuidImage();
        res.json({data : url});
    } catch (err) {
        console.error("Error during data", err);
        res.status(500).json({ error: "An error occurred data" });
    }
};




exports.convertYoutube = async(req,res, next) => {
    const videoUrl = req.query.url;
    try {
        convertToMp3(videoUrl).then(async data => {
            var trsnscrobe = await  transcribeFile(data.file);

            const largestThumbnail = data?.videoInfo?.thumbnails?.reduce((largest, current) => {
                return current.width > largest.width ? current : largest;
            }, data?.videoInfo?.thumbnails[0]  );

            const thumbnail = largestThumbnail?.url ||  await createGuidImage();

            var createViddata = {
                video_type : 'YOUTUBE',
                video_guid : data.id,
                video_title : data?.videoInfo?.title,
                transcript_text : trsnscrobe.text,
                video_url : videoUrl,
                audio_url : data?.file,
                thumbnail_image : thumbnail,
                transcriptId : trsnscrobe?.transcriptId
            }
           await createVideo(createViddata).then(id => {
            res.json({id : id})
           })
        }).catch(err => {
            console.error('Error:', err);
            res.status(500).send('An error occurred while processing the video ' + err);
        })
    

    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while processing the video');
    }

}


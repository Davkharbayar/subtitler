
const { body, validationResult } = require('express-validator');
const { createSubtitle, getSubtitleList, getSubtitle } = require("../../utils/db.util")
const {transcribeFile, sentencesFile} = require("../../utils/assemblyai.util")
const { createGuidImage } = require("../../utils/generateimage.util");
const { createVideo } = require("../../utils/db.util")
const { videoUpload } = require("../../utils/file.util")
const path = require('path')
const { createASSFile, createSRTFile } = require("../../utils/srt.util")
const { createSubtitleVideo, createSubtitleAudio } = require("../../utils/subtitle.util")
const fs = require("fs")


exports.createSubtitle = async(req,res, next) => {
    try {
        videoUpload(req, '/downloads/video/').then(async data => {
            const audioExtensions = ['.mp3', '.wav', '.aac', '.flac', '.ogg'];
            const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
            const fileExtension = path.extname(data.filePath)
            if (audioExtensions.includes(fileExtension)) {
                var backgroundImage =  await createGuidImage();
                var localfile = path.resolve("./" + 'public' + data.filePath);
                var srtPath = path.resolve("./" + 'public' + '/downloads/video/' + `${data.id}.srt`);
                var thumbPath = path.resolve("./" + 'public' + '/downloads/video/' + `${data.id}.png`);
                var animPath = path.resolve("./" + 'public' + '/downloads/video/' + `${data.id}.webp`);
                
                
                var sentences = await  sentencesFile(localfile);
                createSRTFile(sentences, srtPath).then(() => {
                    createSubtitleAudio(localfile, srtPath, data.id, backgroundImage).then(convertedFile => {

                       var originalFile =`/downloads/video/${path.basename(localfile)}`;
                       var srtFile = `/downloads/video/${path.basename(srtPath)}`;
                       var thumbfile = `/downloads/video/${path.basename(thumbPath)}`;
                       var animfile = `/downloads/video/${path.basename(animPath)}`;
                       
                       
                       var saveData = {
                            guid : data.id,
                            original_url : originalFile,
                            srt_url : srtFile,
                            subtitle_url : convertedFile.file,
                            thumb_image : thumbfile,
                            anim_image : animfile
                        }

                        createSubtitle(saveData).then(() => {
                            res.json({ id: data.id })
                        })
                    })
        
                })
            }else if (videoExtensions.includes(fileExtension)) {

                var localfile = path.resolve("./" + 'public' + data.filePath);
                var srtPath = path.resolve("./" + 'public' + '/downloads/video/' + `${data.id}.srt`);
                var thumbPath = path.resolve("./" + 'public' + '/downloads/video/' + `${data.id}.png`);
                var animPath = path.resolve("./" + 'public' + '/downloads/video/' + `${data.id}.webp`);
                
                var sentences = await  sentencesFile(localfile);
                createSRTFile(sentences, srtPath).then(() => {
                    createSubtitleVideo(localfile, srtPath, data.id).then(convertedFile => {
                        var originalFile =`/downloads/video/${path.basename(localfile)}`;
                        var srtFile = `/downloads/video/${path.basename(srtPath)}`;
                        var thumbfile = `/downloads/video/${path.basename(thumbPath)}`;
                        var animfile = `/downloads/video/${path.basename(animPath)}`;
                        var saveData = {
                            guid : data.id,
                            original_url : originalFile,
                            srt_url : srtFile,
                            subtitle_url : convertedFile.file,
                            thumb_image : thumbfile,
                            anim_image : animfile
                        }

                         createSubtitle(saveData).then(() => {
                            res.json({ id : data.id})
                         })

                    })
        
                })
            }else{
                console.error('Unsupported file type:', fileExtension);
                res.status(400).send('Unsupported file type: ' + fileExtension);
            }
        }).catch(err => {
            console.error('Error:', err);
            res.status(500).send('An error occurred while processing the video ' + err);
        })
    

    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred while processing the video');
    }

}




exports.list = async (req, res, next) => {
    try {
        getSubtitleList().then(data => {
            res.json(data);
        })

    } catch (err) {
        console.error("Error during data:", err);
        res.status(500).json({ error: "An error" });
    }
};



exports.get = async (req, res, next) => {
    try {

       var { guid } = req.params;

       console.log(guid + '------------------------------');
       
        getSubtitle(guid).then(data => {

            if (data.length === 0) {
                return res.status(404).json({ error: "Job posting not found." });
            }else{
                res.json(data[0]);
            }

        })

    } catch (err) {
        console.error("Error during data:", err);
        res.status(500).json({ error: "An error" });
    }
};










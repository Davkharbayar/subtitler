require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
var initRouters = require('./api/routes');
const app = express();
const fileUpload = require('express-fileupload');
const path = require('path');
const axios = require('axios');
const PORT = process.env.PORT || 5001;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:5001`;
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');

// Set the ffmpeg binary path
ffmpeg.setFfmpegPath(ffmpegPath);

// Middleware to parse JSON requests
app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
initRouters(app);


app.get('/', async (req, res, next) => {
    try {

        const response = await axios.get(`${API_BASE_URL}/api/subtitle`);
        const videoList = response.data;
        res.render('index', { title: 'Home', message: 'Subtext Studio',  videoList });
    } catch (err) {
        next(err); // Pass error to the error-handling middleware
    }
});


app.get('/subtitle/:guid', async (req, res, next) => {
    try {
        const guid = req.params.guid;
        const response = await axios.get(`${API_BASE_URL}/api/subtitle/${guid}`);
        const video = response.data;

        console.log(video);
        
        res.render('subtitledetail', { title: 'subtitle Detail',  video  });
    } catch (err) {
        next(err); // Pass error to the error-handling middleware
    }
});


// app.get('/job/:jobid', async (req, res, next) => {
//     try {
//         const jobid = req.params.jobid;
//         const response = await axios.get(`${API_BASE_URL}/api/job/${jobid}`);
//         const job = response.data;
//         res.render('jobdetail', { title: 'Job Detail', message: job.title, job: job, similarjobs: [] });
//     } catch (err) {
//         next(err); // Pass error to the error-handling middleware
//     }
// });




// Catch 404 errors and render 404 page
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Error handling middleware for 500 Internal Server Error
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).render('500');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

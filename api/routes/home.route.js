

module.exports = function (app) {
    const controller = require('../controllers/home.controller')

    
    app.get('/api/home/', controller.list);

        
    app.get('/api/home/convert', controller.convertYoutube);

}
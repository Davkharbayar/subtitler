

module.exports = function (app) {
    const controller = require('../controllers/subtitle.controller')

    app.get('/api/subtitle', controller.list);

    app.get('/api/subtitle/:guid', controller.get);

    app.post('/api/subtitle/create', controller.createSubtitle);

}
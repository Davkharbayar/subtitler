
function initRouters(app) {
    require('./home.route')(app);
    require('./subtitle.route')(app);
    

 }
 
 module.exports = initRouters;
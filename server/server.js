var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
var cors = require('cors');
// var basicAuth = require('../services/basicAuth');
// var config = require('../config');
// var jwt = require('../services/jwt');

//Create app
var app = express();

//Enable ALL CORS Requests
app.use(cors());

//App modules
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({type: ['json', 'text']}));

//Compress application responses
app.use(compression());

//Configure security headers
app.use(helmet());

//Handle body parser errors
app.use((err, req, res, next) => {
  if (err) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).send(JSON.stringify({success: false,error: {code: 201, message: "Request has invalid data",details: err}}, null, 3));
  } else {
    next();
  }
})

//Load routes
app.use('/user', require('../routes/users.js'));
app.use('/login', require('../routes/login.js'));
app.use('/request', require('../routes/request.js'));
app.use('/dependencies', require('../routes/dependencies.js'));

//Base routes
app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to Ubelens Extension API'
  });
});

//Export app
module.exports = app;
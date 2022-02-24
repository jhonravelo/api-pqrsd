var mysql = require('mysql2');
var config = require('../config/index');

var state = {
  pool: null,
  mode: null,
}

var ENVIRONMENT = config.general.environment;
var DB_HOST = config.database.host;
var DB_USER = config.database.user;
var DB_PASSWORD = config.database.password;
var DEVELOPMENT_DB = config.database.db;

exports.connect = function(done) {
  state.pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER, 
    password: DB_PASSWORD,
    database: ENVIRONMENT === "production" ? PRODUCTION_DB : DEVELOPMENT_DB,
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  })

  state.mode = ENVIRONMENT;
  done();
}

exports.get = function() {
  return state.pool
}

exports.end = function(cb) {
  state.pool.end(function (err) {
    if (err) {
      cb(err)
    } else {
      cb(null,1);
    }
  });
}
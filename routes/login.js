var express = require("express");
var loginModel = require("../models/login");
var { check, validationResult } = require("express-validator");
var { matchedData, sanitize } = require("express-validator");
var bcrypt = require("bcrypt");
var basicAuth = require("../services/basicAuth");
var jwt = require("../services/jwt");
var log = require("../services/apilogger");
var permission = require("../services/permission");
const mysql = require("mysql2");
var router = express.Router();
var config = require("../config");

var DB_HOST = config.DB_HOST;
var DB_USER = config.DB_USER;
var DB_PASSWORD = config.DB_PASSWORD;
var DEVELOPMENT_DB = config.DEVELOPMENT_DB;

////////////////////////////////////////////////////////////////////////
//                      LOGIN
////////////////////////////////////////////////////////////////////////
router.post("/", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}","user":login}`
    );

    //Handle validation errors
    var errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).send(
        JSON.stringify(
          {
            success: false,
            error: {
              code: 201,
              message: "Request has invalid data",
              details: errors.mapped(),
            },
          },
          null,
          3
        )
      );

    const { username, password } = req.body;
    const values = [username, password];
    var connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DEVELOPMENT_DB,
    });
    connection.query(
      "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?",
      values,
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          if (result.length > 0) {
            res.status(200).send({
              id: result[0].id,
              username: result[0].usuario,
            });
          } else {
            res.status(400).send("Usuario no existe");
          }
        }
      }
    );
    connection.end();
  } catch (err) {
    log.logger.error(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "params":"${JSON.stringify(req.params)}", "query":"${JSON.stringify(
        req.query
      )}", "body":"${JSON.stringify(req.body)}","user":"${
        req.username
      }", "error":"${err}"}`
    );
    return res.status(500).send(
      JSON.stringify(
        {
          success: false,
          error: {
            code: 301,
            message: "Error in service or database",
            details: err,
          },
        },
        null,
        3
      )
    );
  }
});

module.exports = router;

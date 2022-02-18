var express = require("express");
var dependenciesModel = require("../models/dependencies.js");
var { check, validationResult } = require("express-validator");
var { matchedData, sanitize } = require("express-validator");
var jwt = require("../services/jwt");
var log = require("../services/apilogger");
var permission = require("../services/permission");
var awsPromises = require("../services/aws-promises");
var config = require("../config");
const mysql = require("mysql2");

var router = express.Router();

const ENVIRONMENT = config.ENVIRONMENT;
var DB_HOST = config.DB_HOST;
var DB_USER = config.DB_USER;
var DB_PASSWORD = config.DB_PASSWORD;
var DEVELOPMENT_DB = config.DEVELOPMENT_DB;

var keys;
if (ENVIRONMENT === "production") {
  keys = {};
} else {
  keys = {
    accessKeyId: config.ACCESS_KEY_ID,
    secretAccessKey: config.SECRET_ACCESS_KEY,
    signatureVersion: "v4",
    region: config.S3_REGION,
  };
}

////////////////////////////////////////////////////////////////////////
//         Get list of all dependencies
////////////////////////////////////////////////////////////////////////
router.get("/all", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"`
    );

    //Get user account types
    const [[Types]] = await dependenciesModel.getAll();
    if (!Types)
      return res.status(500).send(
        JSON.stringify(
          {
            success: false,
            error: { code: 301, message: "Error in database", details: null },
          },
          null,
          3
        )
      );

    return res
      .status(200)
      .send(
        JSON.stringify(
          { success: true, data: { dependencies: Types } },
          null,
          3
        )
      );
  } catch (err) {
    log.logger.error(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "params":"${JSON.stringify(req.params)}", "query":"${JSON.stringify(
        req.query
      )}", "body":"${JSON.stringify(req.body)}", "error":"${err}"}`
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

    const { Dependencia, Correo } = req.body;
    const values = [Dependencia, Correo];
    var connection = mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DEVELOPMENT_DB,
    });
    connection.query(
      "INSERT INTO dependencias(dependencia, correo) VALUES(?, ?)",
      values,
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send(result);
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

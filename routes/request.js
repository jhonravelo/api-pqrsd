var express = require("express");
var requestModel = require("../models/request.js");
var mailModel = require("../models/mail");
var { check, validationResult } = require("express-validator");
var { matchedData } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
var jwt = require("../services/jwt");
var capitalize = require("capitalize");
var log = require("../services/apilogger");
var permission = require("../services/permission");
var fs = require("fs");
var formidable = require("formidable");
var awsPromises = require("../services/aws-promises");
var config = require("../config");
var multer = require("multer");
const { S3_PRIVATE_BUCKET } = require("../config");
var path = require("path");
const { promisify } = require("util");
const { pipeline } = promisify(require("stream").pipeline);

var upload = multer();

var router = express.Router();

const ENVIRONMENT = config.ENVIRONMENT;

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

router.get("/all", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"`
    );

    //Get user account types
    const [[Types]] = await requestModel.getAll();
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
        JSON.stringify({ success: true, data: { requests: Types } }, null, 3)
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

router.get("/logs", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"`
    );

    //Get Request
    const [[result]] = await requestModel.getLogs();
    if (!result)
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
      .send(JSON.stringify({ success: true, logs: result }, null, 3));
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

router.post("/search", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"`
    );

    //Get Request
    const [result] = await requestModel.getRequest(req.body.InputSearch);
    if (!result)
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
      .send(JSON.stringify({ success: true, data: result }, null, 3));
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

router.patch("/status", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"`
    );

    //Get Request
    const [result] = await requestModel.changeStatus(
      req.body.id,
      req.body.statu
    );
    if (!result)
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
      .send(JSON.stringify({ success: true, data: result }, null, 3));
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

router.post("/dependencies/update", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"`
    );

    const [result] = await requestModel.updateDependencies(
      req.body.id,
      req.body.dependencie
    );
    await mailModel.emailAssignRegister();
    if (!result)
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
      .send(JSON.stringify({ success: true, data: result }, null, 3));
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

router.post("/post", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"}`
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

    log.logger.error(`{"data":"${JSON.stringify(req.body)}"`);

    //Create optometrist
    const [[[RequestId]]] = await requestModel.post(
      req.body.RequestType,
      req.body.Anonymous,
      req.body.PersonType,
      req.body.IdentificationType,
      req.body.Identification,
      req.body.FirstName
        ? req.body.FirstName +
            " " +
            req.body.SecondName +
            " " +
            req.body.SurName +
            " " +
            req.body.SecondSurname
        : null,
      req.body.Email,
      req.body.Phone,
      req.body.Cell,
      req.body.Address,
      req.body.Country,
      req.body.Department,
      req.body.City,
      req.body.ResponseType,
      req.body.Inability,
      req.body.EthnicGroup,
      req.body.GroupInterest,
      req.body.Description,
      req.body.AcceptPolicy,
      req.body.Date,
      req.body.Status,
      req.body.Neighborhood
    );
    await mailModel.emailRequestRegister(req.body);
    if (!mailModel)
    return res.status(500).send(
      JSON.stringify(
        {
          success: false,
          error: {
            code: 301,
            message: "Error in database",
            details: mailModel,
          },
        },
        null,
        3
      )
    );
    if (!RequestId)
      return res.status(500).send(
        JSON.stringify(
          {
            success: false,
            error: {
              code: 301,
              message: "Error in database",
              details: null,
            },
          },
          null,
          3
        )
      );

    return res
      .status(200)
      .send(
        JSON.stringify(
          { success: true, data: { request_id: RequestId } },
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

router.post("/uploads", upload.single("file"), async (req, res) => {
  const { file } = req;
  try {
    res.setHeader("Content-Type", "application/json");
    log.logger.info(
      `{"verb":"${req.method}", "path":"${
        req.baseUrl + req.path
      }", "body":"${JSON.stringify(req.body)}"}`
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

    // const extname = path.extname(file.originalname);

    const fileName = req.body.name + "-" + file.originalname.replace(" ", "-");
    console.log(req.body.name);

    await fs.createWriteStream(`${__dirname}/../public/uploads/${fileName}`);

    const [result] = await requestModel.savefile(
      fileName,
      req.body.request_id
    );
    return res
      .status(200)
      .send(JSON.stringify({ success: true, data: result }, null, 3));
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

router.post("/dependencies", async (req, res) => {
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

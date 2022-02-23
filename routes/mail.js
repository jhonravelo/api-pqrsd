var express = require("express");
var router = express.Router();
const mysql = require("mysql2");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
var config = require("../config");

var DB_HOST = config.DB_HOST;
var DB_USER = config.DB_USER;
var DB_PASSWORD = config.DB_PASSWORD;
var DEVELOPMENT_DB = config.DEVELOPMENT_DB;

router.post("/", async (req, res) => {
  try {
	  
  } catch (error) {}
});

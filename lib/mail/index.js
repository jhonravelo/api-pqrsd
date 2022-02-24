const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01'
  })
});

module.exports = transporter;

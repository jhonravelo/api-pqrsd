const config = require("../config/index");
const formatMail = require("../lib/mail/format");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "jhonjairoravelomora@gmail.com",
      pass: "ysaihnikwabrxkzq",
    },
  });

exports.emailAssignRegister = async () => {
  try {
    const html = formatMail("templates/send_to_assign.html");

    var emailOptions = {
      from: config.email.sender,
      to: "jhonjairoravelomora@gmail.com",
      subject: "Secretaria cucuta | Asignación",
      html,
    //   attachments: allAttachments,
    };

    transporter.sendMail(emailOptions, (err, info) => {
      if (err) {
        return err;
      }
    });
  } catch (err) {
    console.error("Could not send the email notification", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(JSON.stringify(err));
  }
};

exports.emailRequestRegister = async (data) => {
    try {
      const params = {
        REQUEST_EMAIL: data.Email,
        REQUEST_FIRSTNAME: data.FirstName
      };
      const html = formatMail("templates/request_register.html", params);

      const generatedPdfAttachments = [];
      const pdfFile = {
        filename: "file name",
        content: data.allAttachments,
        encoding: 'base64'
      };

      generatedPdfAttachments.push(pdfFile);
  
      var emailOptions = {
        from: config.email.sender,
        to: params.REQUEST_EMAIL,
        subject: "Secretaria cucuta | Solicitud",
        html,
        // attachments: generatedPdfAttachments,
      };
  
      transporter.sendMail(emailOptions, (err, info) => {
        if (err) {
          return err;
        }
      });
    } catch (err) {
      console.error("Could not send the email notification", err);
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(JSON.stringify(err));
    }
  };
  
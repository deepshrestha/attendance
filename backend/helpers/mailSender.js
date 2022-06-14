const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
var smtpConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "pranayamailtester@gmail.com",
    pass: "afpmedtpxiavieso",
  },
};
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
var mailOptions = {
  from: '"CTech HR ?" <hr@creators.institute>', // sender address
  to: "", // list of receivers
  subject: "Regarding CTech Employment Account", // Subject line
  text: "", // plaintext body
  html: "", // html body
};

exports.send = (res, fullName, email, password) => {
  mailOptions.to = email;
  mailOptions.html = `<div> Hello ${fullName}, <br/><br/> Your employment account has been created. <br/>
  Please use these credentials for logging in the CTech Attendance System : 
  <br/>

  Email : ${email} , Password: ${password}
  Thank you. <br/><br/> Regards, <br/>HR Department, <br/>CTech
  </div>`;
  
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json(error);
    }
    res.json(info.response);
  });
};

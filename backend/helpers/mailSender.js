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
  subject: "", // Subject line
  text: "", // plaintext body
  html: "", // html body
};

exports.sendRegistrationEmail = (res, fullName, email, password) => {
  mailOptions.to = email;
  mailOptions.subject = 'Regarding CTech Employment Account';
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

exports.sendLeaveApprovalEmail = (res, fullName, email, leave_processor, leave_type_name, leave_status_name, 
    leave_start_date, leave_end_date) => {
  mailOptions.to = email;
  mailOptions.subject = 'Regarding Leave Request';
  mailOptions.html = `<div> Hello ${fullName}, <br/><br/> Your requested ${leave_type_name} from ${leave_start_date}
  to ${leave_end_date} has been ${leave_status_name} by ${leave_processor}.
  
  <br/>
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

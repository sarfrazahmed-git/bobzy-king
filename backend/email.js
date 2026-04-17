const nodemailer = require('nodemailer');

// 1. Create a transporter object
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // For testing, we'll use a test SMTP server
  port: 587,
  secure: false,
  auth: {
    user: "bobzythekink@gmail.com",
    pass: 'znzj gxyt hsua flna'
  }
});

// 2. Define the email options
const mailOptions = {
  from: 'bobzythekink@gmail.com',
  to: 'sarfrazgo123@gmail.com',
  subject: 'Hello from Node.js',
  text: 'This is a plain text body',
  html: '<div><b>This is an HTML body</b> <img src = "gggg"/></div>' // You can send HTML!
};

// 3. Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error:', error);
  }
  console.log('Message sent: %s', info.messageId);
});
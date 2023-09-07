const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter(transporter is a service that will send the email like gmail- mailtrap- sendgrid - mailgun)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for 578
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  // 2) Define the email options (like: from - to - subject - text - html ....etc)
  const mailOptions = {
    from: "E-Shop App <developermohamed119@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

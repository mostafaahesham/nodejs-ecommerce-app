const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT, // if secure true => 587, false => 465
    service: "Gmail",
    // secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: `E-shop App <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;

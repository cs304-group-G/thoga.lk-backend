import Nodemailer from "nodemailer";

const sendTempPassword = async (payload) => {
  const from = "Thoga.lk <" + process.env.EMAIL_ADDRESS + ">";
  const to = payload.to;
  const subject = "    Verification code for Thoga.lk. (DO NOT SHARE)";
  const text =
    "use this Temp password with given email address to log into your thoga.lk account .\n\nYour temporary Password is : \n\n" +
    payload.tempPassword;
  const html = "";

  let transporter = Nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  var mailOption = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(mailOption, function (error, info) {
    if (error) {
      console.log(error);
    }
  });
};

export default sendTempPassword;

const nodemailer = require("nodemailer");
require("dotenv").config();

const kodeEmail = process.env.emailSender;
const password = process.env.emailPass;

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: kodeEmail,
    pass: password,
  },
});

const sendConfirmation = (Name, email, tokenDB) => {
  console.log("check if in send block");
  transport
    .sendMail({
      from: kodeEmail,
      to: email,
      subject: "All Set, Confirm Your Account",
      html: ` <div style="border-radius: 20px; padding: 20px; background: #f5f5f5;text-align: center;">
       <h1>kode<span style="color: #3f51b5 ;">tech</span></h1>
        <h2 >Email Confirmation</h2>
            <h3 style="color: #3f51b5 ;">Hello ${Name} </h3>

            <p>Thanks for choosing kodetech, click on the following link to activate your account</p>
            <a href=https://kodetech.herokuapp.com/confirm/${tokenDB}>click here</a>

    </div>`,
    })
    .catch((err) => console.log(err));
};

module.exports = { sendConfirmation };

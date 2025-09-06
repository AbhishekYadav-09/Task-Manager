import Mailgen from "mailgen";
import nodemailer from "nodemailer"


export const sendEmail = async ({ user, token, type }) => {
  if (!user || !user.email) {
    throw new Error("User object or email is missing");
  }

const verifyUrl = type === "verification"
  ? `http://localhost:8000/api/v1/users/verify/${token}`
  : `http://localhost:8000/api/v1/users/reset-pass/${token}`;


let mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: user.name,
    link: verifyUrl
  }
});

let email = {
  body: {
    name: user.name,
    intro: type === "verification" ? "welcome please verify your eamil" : "you requsted for reset password",
    action: {
      instructions: type === "verification"
        ? "Click below to verify your account:"
        : "Click below to reset your password:",
      button: {
        color: '#22BC66', // Optional action button color 
        text: type === "verification" ? "Verify Account" : "Reset Password",
        link: verifyUrl
      }
    },
    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
  }
};

let emailBody = mailGenerator.generate(email);



const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false, 
  auth: {
    user: "2c858e4167465e",
    pass: "9e3f1ca19434b9",
  },
});


// (async () => {
//   const info = await transporter.sendMail({
//     from: 'Tech-Titans" <no-reply@tech-titans.com>',
//     to: user.email,
//     subject: type === "verification" ? "Verify your email" : "Reset your password",
//     text: "Hello world?", 
//     html: emailBody,
//   })();
//   console.log("Message sent:", info.messageId);
// });


const info = await transporter.sendMail({
    from: '"Tech-Titans" <no-reply@tech-titans.com>',
    to: user.email,
    subject:
      type === "verification" ? "Verify your email" : "Reset your password",
    text: type === "verification" ? "Verify your account" : "Reset your password",
    html: emailBody,
  });
  console.log(info.messageId);
}
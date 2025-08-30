import Mailgen from "mailgen";
import nodemailer from "nodemailer"


const verifyUrl = `http:localhost:8000/api/v1/users/verify/:${token}`

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
        intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started with Mailgen, please click here:',
            button: {
                color: '#22BC66', // Optional action button color 
                text: 'Confirm your account',
                link: `http://localhost:8000/api/v1/users/verify/:${token}`
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};

let emailBody = mailGenerator.generate(email);


// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "3a15f19f3858df",
    pass: "5af287a850ac1d",
  },
});

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from:  'Name <email@domain.com>',
    to: user.email,
    subject: "Hello ✔",
    text: "Hello world?", // plain‑text body
    html: emailBody, // HTML body
  });

  console.log("Message sent:", info.messageId);
})();

export default mailGenerator
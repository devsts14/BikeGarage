const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const ProfileModel =require("../models/ProfileModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const { OAuth2Client } = require("google-auth-library");
const sgMail = require("@sendgrid/mail");
const _ = require("lodash");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const authMiddleware=require("../middleware/authMiddleware")


router.get("/",authMiddleware,async(req,res)=>{
  const {userId}=req
  try {
    const user=await UserModel.findById(userId)
    return res.status(200).json({user})
    
  } catch (error) {
    console.log(error)
    return res.status(401).send("Server error 123")
    
  }

})

// Login using email and password
router.post("/", async (req, res) => {
  const { email, password } = req.body.user;
  console.log(email);
  if (!isEmail(email)) return res.status(401).send("Invalid Email");
  if (password.length < 6) {
    return res.status(401).send("Password must be atleast 6 characters");
  }
  try {
    const user = await UserModel.findOne({email:email.toLowerCase()}).select(
      "+password"
    );
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).send("Invalid Credentials");
    }

    const payload = { userId: user._id };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json(token);
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// password reset link
router.post("/resetlink", async (req, res) => {
  const { email } = req.body;
  UserModel.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist",
      });
    }
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password Reset link`,
      html: `
                <h1>Please use the following link to reset your password</h1>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };
    return user.updateOne({ resetToken: token }, (err, success) => {
      if (err) {
        console.log("RESET PASSWORD LINK ERROR", err);
        return res.status(400).json({
          error: "Database connection error on user password forgot request",
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            // console.log('SIGNUP EMAIL SENT', sent)
            return res.json({
              message: `Reset link has been sent to ${email}`,
            });
          })
          .catch((err) => {
            // console.log('SIGNUP EMAIL SENT ERROR', err)
            return res.json({
              message: err.message,
            });
          });
      }
    });
  });
});

// reset password
router.post("/reset", async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (resetToken) {
    jwt.verify(
      resetToken,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: "Expired link. Try again",
          });
        }
        UserModel.findOne({ resetToken }, async (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Something went wrong. Try later",
            });
          }
          const updatedFields = {
            resetToken: "",
          };
          updatedFields.password = await bcrypt.hash(newPassword, 10);
          user = _.extend(user, updatedFields);
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error resetting user password",
              });
            }
            res.json({
              message: `Great! Now you can login with your new password`,
            });
          });
        });
      }
    );
  }
});

// Google login
router.post("/google-login", async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const { idToken } = req.body;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        UserModel.findOne({ email }).exec(async (err, user) => {
          if (user) {
            const token = jwt.sign(
              { userId: user._id },
              process.env.jwtSecret,
              {
                expiresIn: "7d",
              }
            );
            return res.status(200).json(token);
          } else {
            let password = bcrypt.hash(email + process.env.jwtSecret,10);
            user = new UserModel({ name, email, password,active:true });
            user.save(async (err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              let profileFields = {};
              profileFields.user = user._id;
              await new ProfileModel(profileFields).save();
              const token = jwt.sign(
                { userId: data._id },
                process.env.jwtSecret,
                { expiresIn: "7d" }
              );
              return res.status(200).json(token);
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
});

module.exports = router;

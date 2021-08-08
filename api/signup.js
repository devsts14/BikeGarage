const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");
const userPng =
  "https://res.cloudinary.com/indersingh/image/upload/v1593464618/App/user_mklcpl.png";
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,7}$/;

// Check username availibility
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    if (username.length < 1) return res.status(401).send("Invalid");

    if (!regexUserName.test(username)) return res.status(401).send("Invalid");

    const user = await UserModel.findOne({ username: username.toLowerCase() });

    if (user) return res.status(401).send("Username already taken");

    return res.status(200).send("Available");
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

// Signup
router.post("/", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body.user;

  if (!isEmail(email)) return res.status(401).send("Invalid Email");

  if (password.length < 6) {
    return res.status(401).send("Password must be atleast 6 characters");
  }

  try {
    let user;
    user = await UserModel.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(401).send("User already registered");
    }

    const token = jwt.sign({ email }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: "2m",
    });

    user = new UserModel({
      name,
      email: email.toLowerCase(),
      password,
      active: false,
      temporaryToken: token,
    });

    user.password = await bcrypt.hash(password, 10);

    user.save(async (err, user) => {
      if (err) {
        console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Error saving user in database. Try signup again",
        });
      }
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=Edge">
        <!--<![endif]-->
        <!--[if (gte mso 9)|(IE)]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if (gte mso 9)|(IE)]>
        <style type="text/css">
        body {width: 600px;margin: 0 auto;}
        table {border-collapse: collapse;}
        table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
        img {-ms-interpolation-mode: bicubic;}
        </style>
        <![endif]-->
        <style type="text/css">
        body, p, div {
        font-family: inherit;
        font-size: 14px;
        }
        body {
        color: #000000;
        }
        body a {
        color: #000000;
        text-decoration: none;
        }
        p { margin: 0; padding: 0; }
        table.wrapper {
        width:100% !important;
        table-layout: fixed;
        -webkit-font-smoothing: antialiased;
        -webkit-text-size-adjust: 100%;
        -moz-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        }
        img.max-width {
        max-width: 100% !important;
        }
        .column.of-2 {
        width: 50%;
        }
        .column.of-3 {
        width: 33.333%;
        }
        .column.of-4 {
        width: 25%;
        }
        @media screen and (max-width:480px) {
        .preheader .rightColumnContent,
        .footer .rightColumnContent {
          text-align: left !important;
        }
        .preheader .rightColumnContent div,
        .preheader .rightColumnContent span,
        .footer .rightColumnContent div,
        .footer .rightColumnContent span {
          text-align: left !important;
        }
        .preheader .rightColumnContent,
        .preheader .leftColumnContent {
          font-size: 80% !important;
          padding: 5px 0;
        }
        table.wrapper-mobile {
          width: 100% !important;
          table-layout: fixed;
        }
        img.max-width {
          height: auto !important;
          max-width: 100% !important;
        }
        a.bulletproof-button {
          display: block !important;
          width: auto !important;
          font-size: 80%;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .columns {
          width: 100% !important;
        }
        .column {
          display: block !important;
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        }
        </style>
        <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
        body {font-family: 'Viga', sans-serif;}
        </style><!--End Head user entered-->
        </head>
        <body>
        <center class="wrapper" data-link-color="#000000" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
          <div class="webkit">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
              <tbody><tr>
                <td valign="top" bgcolor="#FFFFFF" width="100%">
                  <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                    <tbody><tr>
                      <td width="100%">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tbody><tr>
                            <td>
                              <!--[if mso]>
        <center>
        <table><tr><td width="600">
        <![endif]-->
                                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                        <tbody><tr>
                                          <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
        <tbody><tr>
        <td role="module-content">
          <p></p>
        </td>
        </tr>
        </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#A2DBFA">
        <tbody>
        <tr role="module-content">
          <td height="100%" valign="top">
            <table class="column" width="580" style="width:580px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
              <tbody>
                <tr>
                  <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="10cc50ce-3fd3-4f37-899b-a52a7ad0ccce">
        <tbody>
        <tr>
          <td style="padding:0px 0px 40px 0px;" role="module-content" bgcolor="">
          </td>
        </tr>
        </tbody>
        </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f8665f9c-039e-4b86-a34d-9f6d5d439327">
        <tbody>
        <tr>
          <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
            <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="180" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://res.cloudinary.com/devsts14/image/upload/v1625459510/logo_vpmalx.svg" height="150">
         
          </td>
        </tr>
        </tbody>
        </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="10cc50ce-3fd3-4f37-899b-a52a7ad0ccce.1">
        <tbody>
        <tr>
          <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
          </td>
        </tr>
        </tbody>
        </table></td>
                </tr>
              </tbody>
            </table>
            
          </td>
        </tr>
        </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="bff8ffa1-41a9-4aab-a2ea-52ac3767c6f4">
        <tbody>
        <tr>
          <td style="padding:18px 30px 18px 30px; line-height:40px; text-align:inherit; background-color:#A2DBFA;" height="100%" valign="top" bgcolor="#A2DBFA" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #053742; font-size: 40px; font-family: inherit">Thank You for signing up!</span></div><div></div></div></td>
        </tr>
        </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2f94ef24-a0d9-4e6f-be94-d2d1257946b0">
        <tbody>
        <tr>
          <td style="padding:18px 50px 18px 50px; line-height:22px; text-align:inherit; background-color:#A2DBFA;" height="100%" valign="top" bgcolor="#A2DBFA" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 16px; font-family: inherit">Confirm your email address to start using Actern&nbsp;</span></div><div></div></div></td>
        </tr>
        </tbody>
        </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="c7bd4768-c1ab-4c64-ba24-75a9fd6daed8">
        <tbody>
          <tr>
            <td align="center" bgcolor="#A2DBFA" class="outer-td" style="padding:10px 0px 20px 0px;">
              <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                <tbody>
                  <tr>
                  <td align="center" bgcolor="#eac96c" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                    <a href="${process.env.CLIENT_URL}/activate/${token}" style="background-color:#053742; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#ffff; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:20px 30px 20px 30px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Confirm Email</a>
                  </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="30d9a68c-ce13-4754-a845-6c3dc22721ee">
        <tbody>
        <tr>
          <td style="padding:40px 40px 40px 40px; line-height:22px; text-align:inherit; background-color:#053742;" height="100%" valign="top" bgcolor="#fe737c" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 16px">Need more help figuring things out? Our support team is here to help!</span></div>
        <div style="font-family: inherit; text-align: center"><br></div>
        <div style="font-family: inherit; text-align: center"><a href="http://www.google.com"><span style="color: #ffffff; font-size: 16px"><u>Help Center</u></span></a></div><div></div></div></td>
        </tr>
        </tbody>
        </table></td>
                                        </tr>
                                      </tbody></table>
                                      <!--[if mso]>
                                    </td>
                                  </tr>
                                </table>
                              </center>
                              <![endif]-->
                            </td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                  </tbody></table>
                </td>
              </tr>
            </tbody></table>
          </div>
        </center>
        
        
        </body></html>`,
      };
      sgMail
        .send(emailData)
        .then((sent) => {
          console.log("SIGNUP EMAIL SENT", sent);
          return res.json({
            message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
          });
        })
        .catch((err) => {
          console.log("SIGNUP EMAIL SENT ERROR", err);
          return res.json({
            message: err.message,
          });
        });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Server error`);
  }
});

router.post("/getname", async (req, res) => {
  const { activationToken } = req.body;
  console.log(activationToken);
  if (activationToken) {
    const user = await UserModel.findOne({ temporaryToken: activationToken });
    if (!user) {
      return res.status(200).json({ message: "No such user found" });
    }
    console.log(activationToken);
    return res.status(200).json({ name: user.name });
  }
});

// Activate account
router.post("/activate", async (req, res) => {
  const { token } = req.body;
  console.log(token);

  if (token) {
    const user = await UserModel.findOne({ temporaryToken: token });

    if (!user) {
      return res.status(200).json({
        error: "Expired link. Signup again",
        message: "expired-activated",
      }); // Token may be valid but does not match any user in the database
    }
    if (user.active === true) {
      return res.json({ message: "activated" });
    }

    console.log(user, "User");
    console.log(token, "Token");
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      async function (err, decoded) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(200).json({
            error: "Expired link. Signup again",
            message: "link expired",
          });
        }
        user.temporaryToken = false; // Remove temporary token
        user.active = true; // Change account status to Activated
        user.save(async (err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving user in database. Try signup again",
            });
          }
          // If save succeeds create profile and follower model and send confirmation email
          let profileFields = {};
          profileFields.user = user._id;
          await new ProfileModel(profileFields).save();

          const emailActivate = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Account Activated",
            text: `Hello ${user.name}, Your account has been successfully activated!`,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
            <!--[if !mso]><!-->
            <meta http-equiv="X-UA-Compatible" content="IE=Edge">
            <!--<![endif]-->
            <!--[if (gte mso 9)|(IE)]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
            <!--[if (gte mso 9)|(IE)]>
        <style type="text/css">
          body {width: 600px;margin: 0 auto;}
          table {border-collapse: collapse;}
          table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
          img {-ms-interpolation-mode: bicubic;}
        </style>
      <![endif]-->
            <style type="text/css">
          body, p, div {
            font-family: inherit;
            font-size: 14px;
          }
          body {
            color: #000000;
          }
          body a {
            color: #000000;
            text-decoration: none;
          }
          p { margin: 0; padding: 0; }
          table.wrapper {
            width:100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          img.max-width {
            max-width: 100% !important;
          }
          .column.of-2 {
            width: 50%;
          }
          .column.of-3 {
            width: 33.333%;
          }
          .column.of-4 {
            width: 25%;
          }
          @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
              text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
              text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
              font-size: 80% !important;
              padding: 5px 0;
            }
            table.wrapper-mobile {
              width: 100% !important;
              table-layout: fixed;
            }
            img.max-width {
              height: auto !important;
              max-width: 100% !important;
            }
            a.bulletproof-button {
              display: block !important;
              width: auto !important;
              font-size: 80%;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .columns {
              width: 100% !important;
            }
            .column {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
          }
        </style>
            <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
          body {font-family: 'Viga', sans-serif;}
      </style><!--End Head user entered-->
          </head>
          <body>
            <center class="wrapper" data-link-color="#000000" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
              <div class="webkit">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
                  <tbody><tr>
                    <td valign="top" bgcolor="#FFFFFF" width="100%">
                      <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                        <tbody><tr>
                          <td width="100%">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tbody><tr>
                                <td>
                                  <!--[if mso]>
          <center>
          <table><tr><td width="600">
        <![endif]-->
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                            <tbody><tr>
                                              <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
          <tbody><tr>
            <td role="module-content">
              <p></p>
            </td>
          </tr>
        </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#A2DBFA">
          <tbody>
            <tr role="module-content">
              <td height="100%" valign="top">
                <table class="column" width="580" style="width:580px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
                  <tbody>
                    <tr>
                      <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="10cc50ce-3fd3-4f37-899b-a52a7ad0ccce">
          <tbody>
            <tr>
              <td style="padding:0px 0px 40px 0px;" role="module-content" bgcolor="">
              </td>
            </tr>
          </tbody>
        </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f8665f9c-039e-4b86-a34d-9f6d5d439327">
          <tbody>
            <tr>
              <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
                <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="180" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://res.cloudinary.com/devsts14/image/upload/v1625459510/logo_vpmalx.svg" height="150">
             
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="10cc50ce-3fd3-4f37-899b-a52a7ad0ccce.1">
          <tbody>
            <tr>
              <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
              </td>
            </tr>
          </tbody>
        </table></td>
                    </tr>
                  </tbody>
                </table>
                
              </td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="bff8ffa1-41a9-4aab-a2ea-52ac3767c6f4">
          <tbody>
            <tr>
              <td style="padding:18px 30px 18px 30px; line-height:40px; text-align:inherit; background-color:#A2DBFA;" height="100%" valign="top" bgcolor="#A2DBFA" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #053742; font-size: 40px; font-family: inherit">Your account has been activated sucessfully!!</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2f94ef24-a0d9-4e6f-be94-d2d1257946b0">
          <tbody>
            <tr>
              <td style="padding:18px 50px 18px 50px; line-height:22px; text-align:inherit; background-color:#A2DBFA;" height="100%" valign="top" bgcolor="#A2DBFA" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 16px; font-family: inherit">Hey ${user.name},Welcome to actern&nbsp;</span></div><div></div></div></td>
            </tr>
          </tbody>
        </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="c7bd4768-c1ab-4c64-ba24-75a9fd6daed8">
            <tbody>
              <tr>
                <td align="center" bgcolor="#A2DBFA" class="outer-td" style="padding:10px 0px 20px 0px;">
                  <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                    <tbody>
                      <tr>
                      <td align="center" bgcolor="#eac96c" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                        <a href="${process.env.CLIENT_URL}" style="background-color:#053742; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#ffff; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:20px 30px 20px 30px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Visit Site</a>
                      </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="30d9a68c-ce13-4754-a845-6c3dc22721ee">
          <tbody>
            <tr>
              <td style="padding:40px 40px 40px 40px; line-height:22px; text-align:inherit; background-color:#053742;" height="100%" valign="top" bgcolor="#fe737c" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 16px">Need more help figuring things out? Our support team is here to help!</span></div>
      <div style="font-family: inherit; text-align: center"><br></div>
      <div style="font-family: inherit; text-align: center"><a href="http://www.google.com"><span style="color: #ffffff; font-size: 16px"><u>Help Center</u></span></a></div><div></div></div></td>
            </tr>
          </tbody>
        </table></td>
                                            </tr>
                                          </tbody></table>
                                          <!--[if mso]>
                                        </td>
                                      </tr>
                                    </table>
                                  </center>
                                  <![endif]-->
                                </td>
                              </tr>
                            </tbody></table>
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </div>
            </center>
          
        
      </body></html>`,
          };

          // Send e-mail object to user
          sgMail
            .send(emailActivate)
            .then((sent) => {
              console.log("SIGNUP EMAIL SENT", sent);
            })
            .catch((err) => {
              console.log("SIGNUP EMAIL SENT ERROR", err);
            });
          const payload = { userId: user._id };
          jwt.sign(
            payload,
            process.env.jwtSecret,
            { expiresIn: "2d" },
            (err, token) => {
              if (err) throw err;
              res.status(200).json({ token, message: "activated" });
            }
          );
        });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
});

router.post("/resend-activation-link", async (req, res) => {
  const { oldToken } = req.body;
  const user = await UserModel.findOne({ temporaryToken: oldToken });
  if (user && user.active === false) {
    const activation = "activation";
    const token = jwt.sign({ activation }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: "10m",
    });
    user.temporaryToken = token;
    user.save(async (err, user) => {
      if (err) {
        console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
        return res.status(401).json({
          error: "Error saving user in database. Try signup again",
        });
      }
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `Account activation link`,
        html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <style type="text/css">
      body {width: 600px;margin: 0 auto;}
      table {border-collapse: collapse;}
      table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
      img {-ms-interpolation-mode: bicubic;}
      </style>
      <![endif]-->
      <style type="text/css">
      body, p, div {
      font-family: inherit;
      font-size: 14px;
      }
      body {
      color: #000000;
      }
      body a {
      color: #000000;
      text-decoration: none;
      }
      p { margin: 0; padding: 0; }
      table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      }
      img.max-width {
      max-width: 100% !important;
      }
      .column.of-2 {
      width: 50%;
      }
      .column.of-3 {
      width: 33.333%;
      }
      .column.of-4 {
      width: 25%;
      }
      @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      }
      </style>
      <!--user entered Head Start--><link href="https://fonts.googleapis.com/css?family=Viga&display=swap" rel="stylesheet"><style>
      body {font-family: 'Viga', sans-serif;}
      </style><!--End Head user entered-->
      </head>
      <body>
      <center class="wrapper" data-link-color="#000000" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#FFFFFF">
            <tbody><tr>
              <td valign="top" bgcolor="#FFFFFF" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tbody><tr>
                          <td>
                            <!--[if mso]>
      <center>
      <table><tr><td width="600">
      <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                      <tbody><tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
      <tbody><tr>
      <td role="module-content">
        <p></p>
      </td>
      </tr>
      </tbody></table><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#A2DBFA">
      <tbody>
      <tr role="module-content">
        <td height="100%" valign="top">
          <table class="column" width="580" style="width:580px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0" bgcolor="">
            <tbody>
              <tr>
                <td style="padding:0px;margin:0px;border-spacing:0;"><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="10cc50ce-3fd3-4f37-899b-a52a7ad0ccce">
      <tbody>
      <tr>
        <td style="padding:0px 0px 40px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
      </tbody>
      </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="f8665f9c-039e-4b86-a34d-9f6d5d439327">
      <tbody>
      <tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="180" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://res.cloudinary.com/devsts14/image/upload/v1625459510/logo_vpmalx.svg" height="150">
       
        </td>
      </tr>
      </tbody>
      </table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="10cc50ce-3fd3-4f37-899b-a52a7ad0ccce.1">
      <tbody>
      <tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
      </tbody>
      </table></td>
              </tr>
            </tbody>
          </table>
          
        </td>
      </tr>
      </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="bff8ffa1-41a9-4aab-a2ea-52ac3767c6f4">
      <tbody>
      <tr>
        <td style="padding:18px 30px 18px 30px; line-height:40px; text-align:inherit; background-color:#A2DBFA;" height="100%" valign="top" bgcolor="#A2DBFA" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #053742; font-size: 40px; font-family: inherit">Thank You for signing up!</span></div><div></div></div></td>
      </tr>
      </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="2f94ef24-a0d9-4e6f-be94-d2d1257946b0">
      <tbody>
      <tr>
        <td style="padding:18px 50px 18px 50px; line-height:22px; text-align:inherit; background-color:#A2DBFA;" height="100%" valign="top" bgcolor="#A2DBFA" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 16px; font-family: inherit">Confirm your email address to start using Actern&nbsp;</span></div><div></div></div></td>
      </tr>
      </tbody>
      </table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="c7bd4768-c1ab-4c64-ba24-75a9fd6daed8">
      <tbody>
        <tr>
          <td align="center" bgcolor="#A2DBFA" class="outer-td" style="padding:10px 0px 20px 0px;">
            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
              <tbody>
                <tr>
                <td align="center" bgcolor="#eac96c" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                  <a href="${process.env.CLIENT_URL}/activate/${token}" style="background-color:#053742; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#ffff; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:20px 30px 20px 30px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Confirm Email</a>
                </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      </table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="30d9a68c-ce13-4754-a845-6c3dc22721ee">
      <tbody>
      <tr>
        <td style="padding:40px 40px 40px 40px; line-height:22px; text-align:inherit; background-color:#053742;" height="100%" valign="top" bgcolor="#fe737c" role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #ffffff; font-size: 16px">Need more help figuring things out? Our support team is here to help!</span></div>
      <div style="font-family: inherit; text-align: center"><br></div>
      <div style="font-family: inherit; text-align: center"><a href="http://www.google.com"><span style="color: #ffffff; font-size: 16px"><u>Help Center</u></span></a></div><div></div></div></td>
      </tr>
      </tbody>
      </table></td>
                                      </tr>
                                    </tbody></table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </div>
      </center>
      
      
      </body></html>
              `,
      };
      sgMail
        .send(emailData)
        .then((sent) => {
          console.log("SIGNUP EMAIL SENT", sent);
          return res.json({
            message: `Email has been sent to ${user.email}. Follow the instruction to activate your account`,
          });
        })
        .catch((err) => {
          console.log("SIGNUP EMAIL SENT ERROR", err);
          return res.json({
            message: err.message,
          });
        });
    });
  }
});

module.exports = router;

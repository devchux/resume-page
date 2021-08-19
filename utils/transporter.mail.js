const nodemailer = require("nodemailer");
const path = require("path");

const sendMail = (req) => {
  let mailOptions = {
    from: req.body.from,
    to: "chukwudieze97@gmail.com",
    subject: req.body.subject,
    text: req.body.text,
    html: `
    ${req.body.text}
    <br><br>
    from: ${req.body.from}
    `,
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  const imagePath = path.join(__dirname, "images", "thank-you.png");

  const message = {
    from: {
      name: 'Chukwudi Eze',
      address: mailOptions.to
    },
    to: mailOptions.from,
    subject: "I Recieved Your Message",
    text: "Thank you for contacting Chukwudi",
    attachment: [
      {
        filename: "thank-you.png",
        path: imagePath,
        cid: "unique@kreata.ee",
      },
    ],
    html: `
    <div>
      <img style="width:250px;" src="cid:unique@kreata.ee">
    </div>
    <p>
      Hi,
      <br><br>
      Thank you for contacting me through my resume page. Your message has been duely noted.
      <br><br>
      I am open to opportunities revolving around technology so feel free to hire me.
    </p>
    `,
  };

  Promise.all([
    transporter.sendMail(mailOptions),
    transporter.sendMail(message),
  ])
    .then(() => {
      req.flash(
        "info",
        "Thank you for reaching out to me. A response mail has been sent to email. Do check it out."
      );
    })
    .catch((error) => {
      req.flash(
        "danger",
        error.message
      );
    });
};

module.exports = sendMail;

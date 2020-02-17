const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '465',
    secure: 'true',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USERNAME,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessToken: process.env.OAUTHCLIENT_ACCESS_TOKEN
    }
});

const sendMessage = (mailOptions) => {
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(info);
        }
    });
}

const alertMover = (gameInfo, recipient) => {
    const opponent = recipient === "sente" ? "gote" : "sente";
    const mailOptions = {
        from: "Colin's Shogi Server <" + process.env.EMAIL_USERNAME +">",
        to: gameInfo[recipient + "Contact"],
        subject: "It's your turn to play against " + gameInfo[opponent + "Nick"],
        html:
            `<p>Hi ${gameInfo[recipient + "Nick"]},</p>

<p>It's your turn to play in your game against ${gameInfo[opponent + "Nick"]}. Please follow the link below to view the game and make your move.</p>

<p>https://shogiserver.herokuapp.com/game/${gameInfo[recipient + "Access"]}</p>

<div>Best,<br/>
Colin Grant's Shogi Server</div>
`
    }

    sendMessage(mailOptions);

};

const alertCreated = (gameInfo, recipient) => {
    const opponent = recipient === "sente" ? "gote" : "sente";
    const mailOptions = {
        from: "Colin's Shogi Server <" + process.env.EMAIL_USERNAME +">",
        to: gameInfo[recipient + "Contact"],
        subject: "A new game has been started against " + gameInfo[opponent + "Nick"],
        html:
            `<p>Hi ${gameInfo[recipient + "Nick"]},</p>

<p>There's a new game between you and ${gameInfo[opponent + "Nick"]}. Please follow the link below to view the game.</p>

<p>https://shogiserver.herokuapp.com/game/${gameInfo[recipient + "Access"]}</p>

<div>Best,<br/>
Colin Grant's Shogi Server</div>
`
    }

    sendMessage(mailOptions);
}



module.exports = {alertMover, alertCreated};
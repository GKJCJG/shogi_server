const mailerAuth = require("../keys");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: mailerAuth
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
        from: "Colin's Shogi Server <" + mailerAuth.user +">",
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
        from: "Colin's Shogi Server <" + mailerAuth.user +">",
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
const config         = require('./cfg/config.json');
//Add api de envio email
const nodemailer = require('nodemailer');
function sendMail(msg) { 
    const mailerClient = nodemailer.createTransport(config.nodeMailerSetup.transporte);
    const message = {
        from: config.nodeMailerSetup.messageHeader.from,     
        to: config.nodeMailerSetup.messageHeader.to,        
        subject: config.nodeMailerSetup.messageHeader.subject,  
        text: msg                          
    };
    mailerClient.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}

module.exports = sendMail;    
var _ = require('lodash')

const nodemailer = require('nodemailer');

var config = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'jhramirezrojas@gmail.com',
        pass: 'Kurt0916'
    }
};

var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'jhramirezrojas@gmail.com',
    text: 'test test'
}

const send = (to, subject, html) => {

    //use default setting
    mail = _.merge({html}, defaultMail, to);
    
    transporter.sendMail(mail, function(error,info){
        if(error) return console.log(error);
        console.log('mail sent', info.response)
    })
}

module.exports = {
    send
}
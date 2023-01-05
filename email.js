const nodemailer = require('nodemailer')

async function main(token, firstName, email){
    try{
        let transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    })

    let mailInfo = {
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: 'Ontario Provincial Parks Token' ,
        html: `<p>Hi ${firstName} <br><br> Here is your token: ${token} <br><br> Please keep it safe <br><br> Thanks, <br> Your friendly neighbourhood dev</p>`
    }

    transporter.sendMail(mailInfo, (err, info) => {
        if(err){
            console.log(err)
        }
        else{
            console.log(`email sent: ${info.response}`)
        }
    })
    }
   
    catch(err){
        console.log(err)
    }
}



module.exports = main
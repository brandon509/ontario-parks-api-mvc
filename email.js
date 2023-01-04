const nodemailer = require('nodemailer')

async function main(token){
    try{
        let testAccount = await nodemailer.createTestAccount()
        let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        post: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })

    let info = await transporter.sendMail({
        from: 'foo@example.com',
        to: 'boo@example.com',
        subject: 'Open this email for your token' ,
        text: `Here is your token: ${token}` ,
        html: "<h1>Did my test work</h1>"
    })

    //console.log('Message Sent: %s', info.messageId)

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }
   
    catch(err){
        console.log(err)
    }
}



module.exports = main
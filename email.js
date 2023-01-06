const nodemailer = require('nodemailer')

async function main(object){
    try{
        let transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    })

    let mailInfo = {}

    if(object.route == 'signup'){
        mailInfo = {
            from: process.env.NODEMAILER_USER,
            to: object.email,
            subject: 'Ontario Provincial Parks Token',
            html: `<p>Hi ${object.firstName} <br><br> Here is your token: ${object.token} <br><br> Please keep it safe <br><br> Thanks, <br> Your friendly neighbourhood dev</p>`
        }
    }

    if(object.route == 'register'){
        mailInfo = {
            from: process.env.NODEMAILER_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New User to Review',
            html: `<p>Hi Brandon <br><br> The following user has requested admin access to the Ontario Provincial Parks api: <ul><li>${object.firstName} ${object.lastName}</li></ul><br> Please log on to the admin portal to approve or reject</p>`
        }
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
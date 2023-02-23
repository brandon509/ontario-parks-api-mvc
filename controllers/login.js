const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')

module.exports = {
    loginPage: async (req, res) => {
        try{
            res.render('logon.ejs')
        }

        catch(err){
            console.log(err)
        }
    },
    account: async (req, res) => {
        try{
            const {email,password} = req.body
            if(!email || !password){
                res.status(400).json('both email and password are required to login')
            }

            const user = await Admin.findOne({email})

            if(user && await bcrypt.compare(password, user.password)){
                res.status(201).redirect('/admin')
            }
            else{
                res.status(401).json('invalid credentials')
            }
        }

        catch(err){
            console.log(err)
        }
    },
    register: async (req, res) => {
        try{
            const {firstName, lastName, email, password} = req.body
            if(!firstName || !lastName || !email || !password){
                res.status(400).json('please complete all fields')
            }

            const userCheck = await Admin.findOne({email})
            if(userCheck){
                res.status(400).json(`${email} is already associated with an account, please login to continue`)
            }

            const encryptedPassword = await bcrypt.hashSync(password, 10)
            const user = await Admin.create({
                firstName,
                lastName,
                email,
                password: encryptedPassword
            })
            
            console.log('User has been registered')
            res.status(201).redirect('/login')

        }
                
        catch(err){
            console.log(err)  
        }
    }

}





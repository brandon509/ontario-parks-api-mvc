const User = require('../models/home')

module.exports = {
    getHome: async (req,res) => {
        try{
            res.render('home.ejs')
        }
        catch(err){
            console.log(err)
        }
    },
    signup: async (req,res) => {
        try{
            const {firstName, lastName, email} = req.body
            if(!firstName || !lastName || !email){
                res.status(400).json('all fields are required')
            }
            
            const userCheck = await User.findOne({email})
            if(userCheck){
                res.status(400).json('there is already an account associated with the provided email')
            }
            
            const user = await User.create({
                firstName,
                lastName,
                email
            })

            res.status(200).redirect('/')
            
        }
            
        catch(err){
            console.log(err)
        }
    }
}
const Park = require('../models/api')
const Admin = require('../models/admin')

module.exports = {
    adminPage: async (req, res) => {
        try{
            const admins = await Admin.find({admin: false})
            res.render('admin.ejs', {admins: admins})
        }
        
        catch(err){
            console.log(err)
        }
    },
    approve: async (req, res) => {
        try{
            let user = await Admin.findOne({_id: req.body.id})
            if(!user){
                res.status(400).json('User does not exist')
            }
            else{
                user.admin = true
                user = await user.save()
                res.status(200).json(`${user.firstName} ${user.lastName} has been added as an admin`)
            }
        }

        catch(err){
            console.log(err)
        }
    },
    delete: async (req, res) => {
        try{
            const user = await Admin.deleteOne({id: req.body._id})
            res.status(200).json(`User has been denied admin access and removed from the system`)
        }

        catch(err){
            console.log(err)
        }
    },
    newPark: async (req, res) => {
        try{
            const {name, location, address, region, size, yearEstablished, phoneNumber} = req.body

            const parkCheck = await Park.findOne({name})
            if(parkCheck){
                res.status(400).json(`${name} has already been added to the database`)
            }

            const park = await Park.create({
                name,
                location,
                address,
                region,
                size,
                yearEstablished,
                phoneNumber 
            })

            res.status(201).redirect('/admin')
        }

        catch(err){
            console.log(err)
        }
    }
}
   
    
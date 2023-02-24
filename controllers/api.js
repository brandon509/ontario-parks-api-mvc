const Park = require('../models/api')

module.exports = {
    all: async (req, res) => {
        try{
            const allParks = await Park.find()
            res.status(200).json(allParks)
        }

        catch(err){
            console.log(err)
        }
    },
    region: async (req, res) => {
        try{      
            const region = req.params.region.toLowerCase()
            const regionCheck = await Park.find({region})
                        
            if(regionCheck.length != 0){
                res.status(200).json(regionCheck)
            }
            else{
                res.status(404).json({error: `region ${region} does not exist`}) 
            }
        }

        catch(err){
            console.log(err)
        }
    },
    parkName: async (req, res) => {
        try{
            const parkName = req.params.park.toLowerCase()
            const park = await Park.findOne({name: parkName})

            if(park){
                res.status(200).json(park)
            }
            else{
                res.status(404).json(`${parkName} does not exist in the db`)
            }
        }

        catch(err){
            console.log(err)
        }
    }
}

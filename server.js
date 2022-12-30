const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const apicache = require('apicache')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const data = require('./data.js')
const auth = require('./authentication')

const app = express()
let cache = apicache.middleware

mongoose.set('strictQuery', false)

const connString = process.env.CONNECTION_STRING
const PORT = process.env.PORT || 8000

main().catch(err => {
    console.log('database connection failed, exiting now...')
    process.exit(1)
})

async function main(){
    await mongoose.connect(connString)

    app.use(express.json())

    app.post('/api/register', async (req,res) => {
        try{
            const {firstName, lastName, email, password} = req.body
            const encryptedPassword = await bcrypt.hashSync(password, 10)
            const user = await data.User.create({
                firstName,
                lastName,
                email,
                password: encryptedPassword
            })
                
            res.status(201).json(user)
        }
                
        catch (err){
            if(err.code == 11000){
                res.status(400).json(`an account already exists with the email ${err.keyValue.email}. please log in instead`)
            }
            else if(err.name == 'ValidationError'){
                res.status(400).json(`please ensure all fields have been populated`)
            }
            else{
                res.status(400).json(err)
                }
        }
    })

    app.post('/api/login', async (req,res) => {
        try{
            const {email,password} = req.body
            if(!email || !password){
                res.status(400).json('missing information. email and password required')
            }

            const user = await data.User.findOne({email})

            if(!user.enabled){
                res.json('Please wait for your account to be verified')
            }

            if(user && await bcrypt.compare(password, user.password)){
                const token = jwt.sign({userID: user._id, email}, `${process.env.TOKEN_KEY}`, {expiresIn: '2h'})
                user.token = token
                res.status(201).json(user)
            }

            res.status(401).json('Invalid Credentials!')
        }

        catch(err){
            console.log(err)
        }
    })

    app.post('/api/new', auth, async (req,res) => {
        try{
            const {name, location, address, region, size, yearEstablished, phoneNumber} = req.body
            let park = await data.Park.create({
                name,
                location,
                address,
                region,
                size,
                yearEstablished,
                phoneNumber 
            })
        res.status(201).json(park)
        }

        catch(err){
            res.status(400).json(err)
            console.err(`unknown error occurred: ${err}`)
        }
    })

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}...`)
    })
}



// MongoClient.connect(connString)
//     .then(client => {
//         console.log('database connected successfully...')
//         const db = client.db('ontario-provincial-parks')
//         const dbCollection = db.collection('ontario-provincial-parks')
//         const logFile = fs.createWriteStream(path.join(__dirname, "server.log"), {flags: 'a'})

//         //======================================
//         // Middlewares
//         //======================================

//         app.use(express.json())
//         app.use(morgan('combined', {stream: logFile}))
//         app.use(cors())
//         app.use(cache('5 minutes'))

//         //======================================
//         // Routes
//         //======================================

//         app.get('/api/parks/all', (req,res) => {
//             dbCollection.find().toArray()
//             .then(result => {
//                 res.json(result)
//             })
//             .catch(err => console.error(err))
//         })

//         app.get('/api/parks/region/:region',(req,res) => {
//             const region = req.params.region.toLowerCase()
//             dbCollection.find({region: `${region}`}).toArray()
//                 .then(result => {
//                     if(result.length != 0){
//                         res.json(result) 
//                     }
//                     else{
//                         res.status(404).json({error: `region ${region} does not exist`}) 
//                     }
//                 })
//                 .catch(err => console.error(err))
//         })

//         app.get('/api/parks/name/:park',(req,res) => {
//             const parkName = req.params.park.toLowerCase()
//             dbCollection.findOne({name: `${parkName}`})
//                 .then(result => {
//                     if(result){
//                         res.json(result) 
//                     }
//                     else{
//                         res.status(404).json({error: `park ${parkName} does not exist`}) 
//                     }
//                 })
//                 .catch(err => console.error(err))
//         })

//         app.post('/api/new', (req,res) => {
//             dbCollection.insertOne(req.body)
//             .then(result => {
//                 console.log(`${req.body.name} has been added to the db...`)
//                 res.json(`${req.body.name} has been added to the db...`)
//             })
//             .catch(err => console.error(err))
//         })


//         //======================================
//         // Listener
//         //======================================

//         const PORT = process.env.PORT || 8000
//         app.listen(PORT, () => {
//             console.log(`server running on port ${PORT}...`)
//         })


//     })
//     .catch(err => {
//         console.log('database connection failed, exiting now...')
//         console.error(err)
//         process.exit(1)
//     })



    //next steps
    //add in all data
    //finish api best practices
    //security/api tokens
    //logging
    //email notification?
    //cache
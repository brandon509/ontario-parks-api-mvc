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
const auth = require('./authentication.js')
const emailSend = require('./email.js')


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

    //======================================
    // Routes
    //======================================

    app.get('/api/parks/all', auth, async (req,res) =>{
        try{
            const allParks = await data.Park.find()
            res.status(200).json(allParks)
        }

        catch(err){
            console.log(err)
        }
    })

    app.get('/api/parks/region/:region', auth, async (req,res) => {
        try{      
            const region = req.params.region.toLowerCase()
            const regionCheck = await data.Park.find({region})
                        
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
    })

    app.get('/api/parks/name/:park', auth, async (req,res) =>{
        try{
            const parkName = req.params.park.toLowerCase()
            const park = await data.Park.findOne({name: parkName})

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
    })

    app.post('/api/signup', async (req,res) =>{
        try{
            const {firstName, lastName, email} = req.body
            if(!firstName || !lastName || !email){
                res.status(400).json('all fields are required')
            }

            const userCheck = await data.User.findOne({email})
            if(userCheck){
                res.status(400).json('there is already an account associated with the provided email')
            }

            const user = await data.User.create({
                firstName,
                lastName,
                email
            })

            const token = jwt.sign({userID: user._id, email, enabled: user.enabled}, `${process.env.TOKEN_KEY}`)
            user.token = token
            emailSend({token,firstName,email})
            res.status(200).json(user)

        }

        catch(err){
            console.log(err)
        }
    })

    app.post('/api/register', async (req,res) => {
        try{
            const {firstName, lastName, email, password} = req.body
            if(!firstName || !lastName || !email || !password){
                res.status(400).json('please complete all fields')
            }

            const userCheck = await data.Admin.findOne({email})
            if(userCheck){
                res.status(400).json(`${email} is already associated with an account, please login to continue`)
            }

            const encryptedPassword = await bcrypt.hashSync(password, 10)
            const user = await data.Admin.create({
                firstName,
                lastName,
                email,
                password: encryptedPassword
            })

            emailSend({firstName, lastName})    
            res.status(201).json(user)
        }
                
        catch(err){
            console.log(err)  
        }
    })

    app.post('/api/login', async (req,res) => {
        try{
            const {email,password} = req.body
            if(!email || !password){
                res.status(400).json('both email and password are required to login')
            }

            const user = await data.Admin.findOne({email})

            if(user && await bcrypt.compare(password, user.password)){
                const token = jwt.sign({userID: user._id, email, enabled: user.enabled}, `${process.env.TOKEN_KEY}`, {expiresIn: '2h'})
                user.token = token
                res.status(201).json(user)
            }

            res.status(401).json('invalid credentials')
        }

        catch(err){
            console.log(err)
        }
    })

    app.post('/api/parks/new', auth, async (req,res) => {
        try{
            const {name, location, address, region, size, yearEstablished, phoneNumber} = req.body

            const parkCheck = await data.Park.findOne({name})
            if(parkCheck){
                res.status(400).json(`${name} has already been added to the database`)
            }

            const park = await data.Park.create({
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
            console.log(err)
        }
    })

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}...`)
    })
}

//next
//make so users cant have true
//email token to general user
//route to make admins true

    //next steps
    //add in all data
    //finish api best practices
    //security/api tokens
    //logging
    //email notification?
    //cache
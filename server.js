const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const app = express()

const connString = process.env.CONNECTION_STRING

MongoClient.connect(connString)
    .then(client => {
        const db = client.db('ontario-provincial-parks')
        const dbCollection = db.collection('ontario-provincial-parks')
        const logFile = fs.createWriteStream(path.join(__dirname, "server.log"), {flags: 'a'})

        //======================================
        // Middlewares
        //======================================

        app.use(express.json())
        app.use(morgan('combined', {stream: logFile}))
        app.use(cors())

        //======================================
        // Routes
        //======================================

        app.get('/api/parks/all', (req,res) => {
            dbCollection.find().toArray()
            .then(result => {
                res.json(result)
            })
            .catch(err => console.error(err))
        })

        app.get('/api/parks/region/:region',(req,res) => {
            const region = req.params.region.toLowerCase()
            dbCollection.find({region: `${region}`}).toArray()
                .then(result => {
                    if(result.length != 0){
                        res.json(result) 
                    }
                    else{
                        res.status(404).json({error: `region ${region} does not exist`}) 
                    }
                })
                .catch(err => console.error(err))
        })

        app.get('/api/parks/name/:park',(req,res) => {
            const parkName = req.params.park.toLowerCase()
            dbCollection.findOne({name: `${parkName}`})
                .then(result => {
                    if(result){
                        res.json(result) 
                    }
                    else{
                        res.status(404).json({error: `park ${parkName} does not exist`}) 
                    }
                })
                .catch(err => console.error(err))
        })

        app.post('/api/new', (req,res) => {
            dbCollection.insertOne(req.body)
            .then(result => {
                console.log(`${req.body.name} has been added to the db...`)
                res.json(`${req.body.name} has been added to the db...`)
            })
            .catch(err => console.error(err))
        })


        //======================================
        // Listener
        //======================================

        const PORT = process.env.PORT || 8000
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT} `)
        })


    })
    .catch(err => console.error(err))



    //next steps
    //add in all data
    //finish api best practices
    //security/api tokens
    //logging
    //email notification?
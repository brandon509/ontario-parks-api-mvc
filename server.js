const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const app = express()

let parks = [
        {
        "name": "Point Farms",
        "location": "Goderich",
        "address": "82491 Bluewater Highway R.R.3",
        "region": "Southwest & Central",
        "size": "307.57 ha",
        "yearEstablished": "1970",
        "phoneNumber": "(519) 524-7124"
    },
    {
        "name": "Arrowhead",
        "location": "Huntsville",
        "address": "451 Arrowhead Park Rd.",
        "region": "Near North",
        "size": "1237.00 ha",
        "yearEstablished": "1971",
        "phoneNumber": "705-789-5105"
    }
    ]

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
            res.json(parks)
        })

        app.get('/api/parks/region/:region',(req,res) => {
            const region = req.params.region.toLowerCase()
            const oneRegion = parks.filter(x => x.region.toLowerCase() == region)
            if(oneRegion.length > 0){
                res.json(oneRegion)   
            }
            else{
                res.status(404).json({error: 'region does not exist'})
            }
        })

        app.get('/api/parks/name/:park',(req,res) => {
            const parkName = req.params.park.toLowerCase()
            const parkInfo = parks.find(x => x.name.toLowerCase() == parkName)
            if(parkInfo){
                res.json(parkInfo)
            }
            else{
                res.status(404).json({error: 'park does not exist'})
            }
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
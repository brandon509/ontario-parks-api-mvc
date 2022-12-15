const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
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


const logFile = fs.createWriteStream(path.join(__dirname, "server.log"), {flags: 'a'})
app.use(morgan('combined', {stream: logFile}))
app.use(cors())


app.get('/api/all', (req,res) => {
    res.json(parks)
})

app.get('/api/region/:region',(req,res) => {
    const region = req.params.region.toLowerCase()
    const oneRegion = parks.filter(x => x.region.toLowerCase() == region)
    if(oneRegion.length > 0){
        res.json(oneRegion)   
    }
    else{
        res.status(404).end()
    }
})

app.get('/api/name/:park', (req,res) => {
    const parkName = req.params.park.toLowerCase()
    const parkInfo = parks.find(x => x.name.toLowerCase() == parkName)
    if(parkInfo){
        res.json(parkInfo)
    }
    else{
        res.status(404).end()
    }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT} `)
})
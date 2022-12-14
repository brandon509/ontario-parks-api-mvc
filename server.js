const express = require('express')
const cors = require('cors')
const app = express()

let parks = {
    "point farms": {
        "name": "Point Farms",
        "location": "Goderich",
        "address": "82491 Bluewater Highway R.R.3",
        "region": "Southwest & Central",
        "size": "307.57 ha",
        "yearEstablished": "1970",
        "phoneNumber": "(519) 524-7124"
    }
}

app.use(cors())

app.get('/api/:park', (req,res) => {
    const parkName = req.params.park.toLowerCase()
    res.json(parks[parkName])
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT} `)
})
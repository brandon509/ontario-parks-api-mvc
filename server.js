const express = require('express')
const app = express()

let parks = {
    "parkName": "Point Farms",
    "location": "Goderich",
    "region": "Southerm",
    "phoneNumber": "519-543-9432"
}

app.get('/', (req,res) => {
    res.json(parks)
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server running on port ${PORT} `)
})
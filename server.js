const express = require('express')
const app = express()
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const loginRoutes = require('./routes/login')
const adminRoutes = require('./routes/admin')
const apiRoutes = require('./routes/api')

require('dotenv').config({path: './config/.env'})

connectDB()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes)
app.use('/login', loginRoutes)
app.use('/admin', adminRoutes)
app.use('/api/parks', apiRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
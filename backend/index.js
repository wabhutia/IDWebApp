require('dotenv').config()
const express = require('express')
const pool = require('./models/db')
const deptRoutes = require('./routes/departmentRoutes')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// Middleware
// - START -

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Error!")
})

app.use('/departments', deptRoutes);

// - END - 


// Express Server
// - START -

app.listen(process.env.PORT, () => {
    console.log("Server is listening on port:", process.env.PORT);
});

// - END -

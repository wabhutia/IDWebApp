require('dotenv').config()
const express = require('express')
const path = require('path')
const deptRoutes = require('./routes/departmentRoutes')
const userRoutes = require('./routes/userRoutes')
const desgRoutes = require('./routes/designationRoutes')
const divisionRoutes = require('./routes/divisionRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('../public'));
app.use(express.static('../public/main'));


// Routes
app.use('/user', userRoutes)
app.use('/departments', deptRoutes);
app.use('/designations', desgRoutes);
app.use('/divisions', divisionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../public/main/pages-error-404.html'));
  });

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server is listening on port:", process.env.PORT);
});




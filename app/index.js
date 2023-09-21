require('dotenv').config()
const express = require('express')
const path = require('path')
const deptRoutes = require('./routes/departmentRoutes')
const userRoutes = require('./routes/userRoutes')
const desgRoutes = require('./routes/designationRoutes')
const divisionRoutes = require('./routes/divisionRoutes')
const formRoutes = require('./routes/formRoutes')

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("HTTP METHOD :- " + req.method + " , URL :- " + req.url);
  next();
});

// Serve static files from the "public" directory
app.use(express.static('./public'));
// app.use(express.static('../public/landingpage'));

app.get("/", (req, res) => {
  res.render("pages-login");
})

app.get("/register", (req, res) => {
  res.render("pages-register")
})

// Routes
app.use('/user', userRoutes)
app.use('/departments', deptRoutes);
app.use('/designations', desgRoutes);
app.use('/divisions', divisionRoutes);
app.use('/form', formRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

app.use((req, res) => {
    res.status(404).render("pages-error-404");
  });

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("Server is listening on port:", process.env.PORT);
});




// app.js
const express = require('express');
const path = require('path');
// const sequelize = require('./config/db');
const app = express();
const port = process.env.PORT || 3000;

// EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// // Serve static files from the '/download' directory
// app.use(express.static(path.join(__dirname, '../downloads')));

// Routes
// const authRoutes = require('./routes/auth');
const rkbRoutes = require('../routes/rkb');

// app.use('/auth', authRoutes);
app.use('/rkb', rkbRoutes);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// const indexRouter = require('./routes/index');

// app.use('/', indexRouter);

app.get('/', async (req, res) => {
   
     res.render('index');
   
    // res.render('index', { user: req.user });
  });

// Database Sync
// sequelize.sync().then(() => {
//     console.log('Database connected');
// }).catch(err => {
//     console.error('Database connection error:', err);
// });

// Start server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

module.exports = app;

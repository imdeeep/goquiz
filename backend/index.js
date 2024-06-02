const express = require('express')
require('dotenv').config();
const cors = require('cors');
const connectDb = require('./config/db');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
const app = express();
const port = process.env.PORT || 5000;


// Connecting to the database 
connectDb().then(() => {
  console.log('Connected to database');
}).catch((err) => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: 'Lax' } // Change secure to true in production
}));


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoute'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

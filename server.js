require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const auth = require('./middlewares/authorization');

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI,
});
const redis = require('./services/redis');

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

app.post('/signin', signin.handleAuthentication(db, bcrypt, redis));
app.delete('/signout', signout.handleSignout(redis));
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt, redis); 
});
app.get('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileGet(req, res, db); 
});
app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db); 
});
app.put('/image', auth.requireAuth, (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
});

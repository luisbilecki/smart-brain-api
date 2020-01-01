const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URL);

const handleSignin = (db, bcrypt, req) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }

  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);

      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(() => Promise.reject('unable to get user'))
      } else {
        return Promise.reject('wrong credentials')
      }
    })
    .catch(() => Promise.reject('wrong credentials'))
}

const getAuthTokenId = () => {
  console.log('auth ok!');
};

const signToken = (email) => {
  const jwtPayload = { email };

  return jwt.sign(
    jwtPayload, 
    process.env.JWT_SECRET, 
    { expiresIn: '2 days' }
  );
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);

  return setToken(token, id)
  .then(() => ({ success: true, userId: id, token }));
};

const handleAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;

  return authorization ? 
    getAuthTokenId() : 
    handleSignin(db, bcrypt, req)
      .then(data => data.id && data.email ? 
          createSessions(data) : 
          Promise.reject(data)
      )
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
};

module.exports = {
  handleSignin,
  handleAuthentication
}
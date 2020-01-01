const jwt = require('jsonwebtoken');
const redisClient = require('../services/redis');

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

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);

  return setToken(token, id)
    .then(() => ({ success: true, userId: id, token }));
};

module.exports = {
  createSession,
};

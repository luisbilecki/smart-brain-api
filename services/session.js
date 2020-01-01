const jwt = require('jsonwebtoken');

const signToken = (email) => {
  const jwtPayload = { email };

  return jwt.sign(
    jwtPayload, 
    process.env.JWT_SECRET, 
    { expiresIn: '2 days' }
  );
};

const setToken = (token, userId, redis) => {
  return Promise.resolve(redis.set(token, userId));
};

const createSession = (user, redis) => {
  const { email, id } = user;
  const token = signToken(email);

  return setToken(token, id, redis)
    .then(() => ({ success: true, userId: id, token }));
};

module.exports = {
  createSession,
};

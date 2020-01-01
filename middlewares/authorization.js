const redisClient = require('../services/redis');
const { extractToken } = require('../helpers/token');

const requireAuth = (req, res, next) => {
  const token = extractToken(req.headers);
  
  if (!token) {
    return res.status(401).json('Unauthorized');
  }

  return redisClient.get(token, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }

    return next();
  });
};

module.exports = {
  requireAuth,
};

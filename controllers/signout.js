const { extractToken } = require('../helpers/token');
const redisClient = require('../services/redis');

const handleSignout = (req, res) => {
  const token = extractToken(req.headers);

  redisClient.del(token, () => {
    return res.json({ success: true });
  });
};

module.exports = {
  handleSignout,
};

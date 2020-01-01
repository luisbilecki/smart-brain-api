const { extractToken } = require('../helpers/token');

const handleSignout = (redis) => (req, res) => {
  const token = extractToken(req.headers);

  redis.del(token, () => {
    return res.json({ success: true });
  });
};

module.exports = {
  handleSignout,
};

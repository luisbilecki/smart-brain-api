const extractToken = (headers) => {
  const token = headers['authorization'] || '';

  if (token.startsWith('Bearer ')) {
    return token.slice(7, token.length).trimLeft();
  }

  return token;
};

module.exports = {
  extractToken
};
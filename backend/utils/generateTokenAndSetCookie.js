const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });
  res.cookie('taskrabbit-token', token, {
    httpOnly: true,
    maxAge: 5 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
  });

  return token;
};

export default generateTokenAndSetCookie;

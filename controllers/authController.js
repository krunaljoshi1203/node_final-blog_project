const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  });
};

exports.getRegister = (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('register', { title: 'Register', error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.render('register', { title: 'Register', error: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', { title: 'Register', error: 'Username already exists' });
    }

    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = new User({
      username,
      password,
      role: userRole
    });

    await user.save();
    generateToken(user, res);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { title: 'Register', error: 'Registration failed. Please try again.' });
  }
};

exports.getLogin = (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('login', { title: 'Login', error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('login', { title: 'Login', error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { title: 'Login', error: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('login', { title: 'Login', error: 'Invalid username or password' });
    }

    generateToken(user, res);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { title: 'Login', error: 'Login failed. Please try again.' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

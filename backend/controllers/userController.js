const User = require('../models/User');

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    const publicUsers = users.map(u => u.toPublicJSON());
    res.json(publicUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    await user.destroy();
    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};


const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated.', user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
};


const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });
    const user = await User.create({ email, password, role: role || 'user' });
    res.status(201).json({ message: 'User created.', user: user.toPublicJSON() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
};

module.exports = { listUsers, deleteUser, changeUserRole, createUser }; 
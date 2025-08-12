const { sequelize } = require('./config/database');
const User = require('./models/User');

async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
    
    // Test finding user with ID 3
    const user = await User.findOne({ where: { id: 3 } });
    console.log('User found:', user ? user.id : 'null');
    if (user) {
      console.log('User data:', user.toJSON());
    }
    
    // Test finding all users
    const allUsers = await User.findAll();
    console.log('All users:', allUsers.map(u => ({ id: u.id, email: u.email })));
    
  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testDatabase(); 
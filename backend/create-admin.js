const User = require('./models/User');
const { sequelize } = require('./config/database');

async function createAdminUser() {
  try {
    await sequelize.sync();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@urbancore.com' } });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@urbancore.com');
      console.log('Password: admin123');
      return;
    }
    
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@urbancore.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('Admin user created successfully!');
    console.log('Email: admin@urbancore.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await sequelize.close();
  }
}

createAdminUser(); 
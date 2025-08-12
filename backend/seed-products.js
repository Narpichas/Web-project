const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');
const { sequelize } = require('./config/database');

async function seedProducts() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  const files = fs.readdirSync(imagesDir)
    .filter(f => !f.startsWith('.') && !f.toLowerCase().includes('logo'));

  const sampleProducts = files.map((filename, idx) => ({
    name: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: 'A cozy and stylish product for your wardrobe.',
    price: (1500 + idx * 100).toFixed(2),
    imageUrl: `/images/${filename}`,
    category: 'General',
    inStock: 10 + idx
  }));

  try {
    await sequelize.sync();
    await Product.bulkCreate(sampleProducts, { ignoreDuplicates: true });
    console.log('Sample products seeded successfully!');
  } catch (err) {
    console.error('Error seeding products:', err);
  } finally {
    await sequelize.close();
  }
}

seedProducts(); 
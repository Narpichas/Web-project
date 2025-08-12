const Product = require('./models/Product');
const { sequelize } = require('./config/database');

async function addLimitedEdition() {
  try {
    await sequelize.sync();
    
    // Check if Limited Edition product already exists
    const existingProduct = await Product.findOne({
      where: { name: 'Limited Edition Collection' }
    });
    
    if (existingProduct) {
      console.log('Limited Edition product already exists!');
      return;
    }
    
    // Add Limited Edition product
    const limitedEditionProduct = await Product.create({
      name: 'Limited Edition Collection',
      description: 'Exclusive limited edition streetwear collection. Only a few pieces available worldwide. Premium quality materials and unique design elements make this a must-have for collectors.',
      price: 2999.99,
      imageUrl: '/images/limited-edition.jpg', // You'll need to add this image
      category: 'Limited Edition',
      inStock: 5
    });
    
    console.log('Limited Edition product added successfully!');
    console.log('Product ID:', limitedEditionProduct.id);
    console.log('Name:', limitedEditionProduct.name);
    console.log('Price: ₨', limitedEditionProduct.price);
    console.log('Stock:', limitedEditionProduct.inStock);
    
  } catch (err) {
    console.error('Error adding Limited Edition product:', err);
  } finally {
    await sequelize.close();
  }
}

addLimitedEdition(); 
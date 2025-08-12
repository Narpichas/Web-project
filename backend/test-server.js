const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test each controller function
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');

console.log('Auth Controller functions:');
console.log('register:', typeof authController.register);
console.log('login:', typeof authController.login);
console.log('getCurrentUser:', typeof authController.getCurrentUser);

console.log('\nProduct Controller functions:');
console.log('getProducts:', typeof productController.getProducts);
console.log('getProduct:', typeof productController.getProduct);
console.log('getCategories:', typeof productController.getCategories);
console.log('getBrands:', typeof productController.getBrands);
console.log('createProduct:', typeof productController.createProduct);
console.log('updateProduct:', typeof productController.updateProduct);
console.log('deleteProduct:', typeof productController.deleteProduct);

app.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
}); 
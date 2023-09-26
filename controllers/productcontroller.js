const Product = require('../models/productmodel');
const Cart = require('../models/cart')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

module.exports = {
    async getProducts(req, res) {
        try {
            const products = await Product.find();
            const productsWithBase64Images = await Promise.all(products.map(async product => {
                const imagePath = path.join(path.dirname(__dirname), 'images', product.image);
                if (fs.existsSync(imagePath)) {
                    const imageBase64 = fs.readFileSync(imagePath, 'base64');
                    return {
                        ...product.toObject(),
                        image: imageBase64
                    };
                } else {
                    console.warn(`Image not found: ${imagePath}`);
                    return product.toObject();
                }
            }));
            res.json(productsWithBase64Images);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving products' });
        }
    },

    async getStats(req, res) {
        try {
            const typeStats = await Product.aggregate([{
                $group: {
                    _id: '$type',
                    count: {
                        $sum: 1
                    }
                }
            }]);
            const kosherStats = await Product.aggregate([{
                $group: {
                    _id: '$kosher',
                    count: {
                        $sum: 1
                    }
                }
            }]);
            const alcoholPercentageStats = await Product.aggregate([{
                $group: {
                    _id: '$alcoholPercentage',
                    count: {
                        $sum: 1
                    }
                }
            }]);

            // Sort by price in descending order
            const products = await Product.find().sort({ price: -1 }).limit(10).lean(); // Added .lean() to convert to plain JS objects
            const stats = {
                typeStats,
                kosherStats,
                alcoholPercentageStats,
                products // Sorted products
            };

            if (res.json) {
                res.json(stats);
            }

            return stats;
        } catch (error) {
            if (res.status) {
                res.status(500).json({ message: 'Error retrieving statistics' });
            }
            throw error;
        }
    },
    async isAdmin(req, res) {
        if (req.session && req.session.user && req.session.user.isAdmin) {
            return true
        }
        return false
    },
    async addProduct(req, res) {
        if (!(req.session && req.session.user && req.session.user.isAdmin))
            return res.status(401).json({ error: 'Unauthorized' });


        try {
            const {
                id,
                name,
                description,
                price,
                image,
                kosher,
                alcoholPercentage,
                volume,
                type,
                drySweet,
                grapeVarieties
            } = req.body;
            const product = new Product({
                id,
                name,
                description,
                price,
                image,
                kosher,
                alcoholPercentage,
                volume,
                type,
                drySweet,
                grapeVarieties
            });
            await product.save();
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while trying to process a new product.', errorString: error.toString() });
        }
    },
    async removeProduct(req, res) {
        try {
            const { name } = req.body;
            const deletedProduct = await Product.findOneAndDelete({ name: name });
            if (deletedProduct) {
                res.status(200).send('Product removed successfully');
            } else {
                res.status(404).send('Product not found');
            }
        } catch (error) {
            console.error('Error removing product:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    async removeFromCart(req, res) {
        if (!(req.session && req.session.user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const productId = req.body.productId;
            const userId = req.session.user._id;
        
            const cart = await Cart.findOne({ userId });
            if (!cart) {
              return res.status(404).json({ error: 'Cart not found' });
            }
            
            const productIndex = cart.products.findIndex(item => Number(item.productId) === Number(productId));
            if (productIndex === -1) {
              return res.status(404).json({ error: 'Product not found in cart' });
            }
        
            cart.products.splice(productIndex, 1);
            await cart.save();
            res.json({ message: 'Cart updated successfully', cart });
        
          } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the cart.', errorString: error.toString() });
          }
    },
    async clearCart(req, res) {
        if (!(req.session && req.session.user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const userId = req.session.user._id;
        
            const cart = await Cart.findOne({ userId });
            if (!cart) {
              return res.status(404).json({ error: 'Cart not found' });
            }
        
            cart.products = [];
            await cart.save();
            res.json({ message: 'Cart updated successfully', cart });
        
          } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the cart.', errorString: error.toString() });
          }
    },
    async addToCart(req, res) {
        if (!(req.session && req.session.user)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const incomingProducts = req.body.selectedProducts;
            const userId = req.session.user._id;
        
            let cart = await Cart.findOne({ userId });
            if (!cart) {
              cart = new Cart({ userId, products: [] });
            }
        
            for (const productId in incomingProducts) {
              const incomingProduct = incomingProducts[productId];
              const existingProduct = cart.products.find(item => Number(item.productId) === Number(productId));
                
              if (existingProduct) {
                existingProduct.quantity = incomingProduct.quantity; 
              } else {
                cart.products.push({ productId: Number(productId), quantity: incomingProduct.quantity }); 
              }
            }
        
            await cart.save();
            res.json({ message: 'Cart updated successfully', cart });
        
          } catch (error) {
            res.status(500).json({ error: 'An error occurred while updating the cart.', errorString: error.toString() });
          }

    },
    async getCart(req, res) {
        if (!(req.session && req.session.user))
            return res.status(401).json({ error: 'Unauthorized' });

        try {
            const userId = req.session.user._id;
            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = new Cart({ userId, products: [] });
                await cart.save();
            }

            const productsInCart = {}
            for (const productInCart of cart.products) {
                const product = await Product.findOne({ id: productInCart.productId });
                if (!product) {
                    // Edge case - In case there's a product that was deleted but still in cart or something
                    continue;
                }
                productsInCart[product.id] = { name: product.name, quantity: productInCart.quantity, id: product.id }
            }
            res.json(productsInCart);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while trying to retrieve the cart.', errorString: error.toString() });
        }
    }

};

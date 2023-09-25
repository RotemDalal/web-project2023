const Product = require('../models/productmodel');
const Cart = require('../models/cart')
// ... other necessary imports
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
            res.status(500).json({message: 'Error retrieving products'});
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
            const products = await Product.find().sort({price: -1}).limit(10).lean(); // Added .lean() to convert to plain JS objects
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
                res.status(500).json({message: 'Error retrieving statistics'});
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
            return res.status(401).json({error: 'Unauthorized'});
        

        try {
            const {
                name,
                description,
                price,
                image,
                kosher
            } = req.body;
            const product = new Product({
                name,
                description,
                price,
                image,
                kosher
            });
            await product.save();
            res.json(product);
        } catch (error) {
            res.status(500).json({error: 'An error occurred while trying to process a new product.', errorString: error.toString()});
        }
    },
    async removeProduct(req, res) {
        try {
            const {name} = req.body;
            const deletedProduct = await Product.findOneAndDelete({name: name});
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
    async addToCart(req, res) {
        if (!(req.session && req.session.user)) 
            return res.status(401).json({error: 'Unauthorized'});
        

        try {
            const {productsInCart} = req.body;
            productsInCart.forEach(async (productInCart) => {
                const product = await Product.find({id: productInCart.id});
                if (!product) {
                    return res.status(404).json({error: 'Product not found'});
                }
                const userId = req.session.user._id;
                let cart = await Cart.findOne({userId});
                if (!cart) {
                    cart = new Cart({userId, products: []});
                }
                const existingProduct = cart.products.find((item) => item.productId === productInCart.id);
                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cart.products.push({productId: productInCart.id, quantity: productInCart.quantity});
                }
                await cart.save();
                res.json({cart, userId});
            })
        } catch (error) {
            res.status(500).json({error: 'An error occurred while adding the product to the cart.', errorString: error.toString()});
        }

    }

};

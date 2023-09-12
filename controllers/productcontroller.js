const Product = require('../models/productmodel');
// ... other necessary imports
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

module.exports = {
    async getProducts(req, res) {
        try {
            const products = await Product.find(); // Assuming you're using Mongoose
            const productsWithBase64Images = await Promise.all(products.map(async product => {
                const imagePath = path.join(path.dirname(__dirname), 'images', product.image);
                if (fs.existsSync(imagePath)) {
                    const imageBase64 = fs.readFileSync(imagePath, 'base64');
                    return { ...product.toObject(), image: imageBase64 };
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
            const typeStats = await Product.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]);
            const kosherStats = await Product.aggregate([
                { $group: { _id: '$kosher', count: { $sum: 1 } } }
            ]);
            const alcoholPercentageStats = await Product.aggregate([
                { $group: { _id: '$alcoholPercentage', count: { $sum: 1 } } }
            ]);

            // Sort by price in descending order
            const products = await Product.find().sort({price: -1}).limit(10).lean();  // Added .lean() to convert to plain JS objects
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
    }
};

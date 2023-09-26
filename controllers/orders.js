
const Order = require('../models/orders')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

module.exports = {
    async getOrders(req, res) {
        try {
            const products = await Order.find();
            
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving orders' });
        }
    },

   
    async addOrder(req, res) {
        if (!(req.session && req.session.user))
            return res.status(401).json({ error: 'Unauthorized' });


        try {
            const {
                productId,
                purchaseDate,
                quantity,
            } = req.body;
            const order = new Order({
                userId:req.session.user?._id,
                productId,
                purchaseDate,
                quantity,
            });
            await order.save();
            res.json(order);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while trying to process a new order.', errorString: error.toString() });
        }
    },


};

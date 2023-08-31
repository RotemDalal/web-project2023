const Product = require('../models/productmodel');
//... other necessary imports
const fs = require('fs');
const path = require('path');
module.exports = {
    async getProducts(req, res) {
        try {

            const products = await Product.find(); // Assuming you're using Mongoose
            console.log('2');
            const productsWithBase64Images = await Promise.all(products.map(async product => {
                //console.log(product.image)


                //   const imagePath = path.join(__dirname, 'images', product.image); // Adjust the path accordingly
                //   const imageBase64 = fs.readFileSync(imagePath, 'base64');
                //   return { ...product.toObject(), image: imageBase64 };

                const imagePath = path.join(path.dirname(__dirname), 'images', product.image);
                console.log(imagePath)
                if (fs.existsSync(imagePath)) {
                    const imageBase64 = fs.readFileSync(imagePath, 'base64');
                    return { ...product.toObject(), image: imageBase64 };
                } else {
                    console.warn(`Image not found: ${imagePath}`);
                    return product.toObject();
                }
            }));
            console.log('3');
            res.json(productsWithBase64Images);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving products' });
        }
    }
};

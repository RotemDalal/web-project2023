const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
const env = process.env.NODE_ENV || "local";
dotenv.config({ path: __dirname + `/config/.env.${env}` });

const { router: shopRouter } = require("./routes/shop");

app.use(express.static( path.join(__dirname, 'static')));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);


app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));

// Connect to MongoDB
mongoose.connect('mongodb+srv://elimelech89:c1tGOio1xrumyuks@cluster0.tqsu78x.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'almog',
    resave: true,
    saveUninitialized: true
}));

//app.use(express.json());
//app.use(cors({
    //origin: '*'
//}));
//app.use(express.json());
//app.use(session({secret: 'your-secret-key', resave: true, saveUninitialized: true}));


const userController = require('./controllers/usercontroller');
const productController = require('./controllers/productcontroller');
const socialController = require('./controllers/socialController');
// Routes
app.use("/shop", require("./routes/shop"));
app.use("/cocktails", require("./routes/cocktails"));
app.use("/checkout", require("./routes/checkout"));
app.use("/wines", require("./routes/wines"));
app.use("/", require("./routes/index"));
app.use("/branch", require("./routes/branches"));
app.use("/profile", require("./routes/profile"));
app.use("/admin", require("./routes/admin"));
app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/logout', userController.logout);
app.get('/api/getCart', productController.getCart)

app.post('/api/addToCart', productController.addToCart)
app.post('/api/addOrder', require("./controllers/orders").addOrder)
app.get('/api/clearCart', productController.clearCart)
app.post('/api/removeFromCart', productController.removeFromCart)
app.get('/products', productController.getProducts);
app.post('/api/postToFB', socialController.postToFB);
app.get('/api/getFBDetails', socialController.getDetails);
app.post('/api/addProduct', productController.addProduct);
app.post('/api/removeProduct', productController.removeProduct);
app.get('/Statistics', productController.getStats);
app
// New /statistics-page route definition
app.get('/statistics-page', async (req, res) => {
    try {
        // Fetch stats using the product controller
        const stats = await productController.getStats(req, { json: (data) => data });
        console.log("Sending stats: ", stats);
        
        res.render('Statistics', { stats });  // Pass the stats to the template
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).send("Error fetching statistics");
    }
});


// app.get('/profile', userController.profile);

//... listen to your server

const http = require("http").Server(app);
http.listen(process.env.PORT || 5500);
const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.static( path.join(__dirname, 'static')));

app.set("view engine", "ejs");
app.engine("ejs", require("ejs").__express);


app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*'
}));
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

// Connect to MongoDB
mongoose.connect('mongodb+srv://elimelech89:c1tGOio1xrumyuks@cluster0.tqsu78x.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userController = require('./controllers/usercontroller');
const productController = require('./controllers/productcontroller');

// Routes
app.use("/shop", require("./routes/shop"));
app.use("/branch", require("./routes/branches"));
app.post('/register', userController.register);
app.post('/login', userController.login);

app.get('/products', productController.getProducts);
app.get('/Statistics', productController.getStats);

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
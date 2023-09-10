const User = require('../models/usermodel');
//... other necessary imports

module.exports = {
    async isAuthenticated(req, res, next) {
        if (req.session && req.session.user) {
            return next();
        }
        return res.redirect('/index.html');
    },

    async isAdmin(req, res, next) {
        if (req.session && req.session.user && req.session.user.isAdmin) {
            return next();
        }
        return res.redirect('/index.html');
    },

    async profile(req, res) {
        res.render("../views/profile.ejs", { username: req.session.user?.username, isAdmin: req.session.user?.isAdmin });
    },

    async admin(req, res) {
        res.render("../views/admin.ejs", { username: req.session.user?.username, isAdmin: req.session.user?.isAdmin });
    },

    async register(req, res) {
        try {
            const { username, password } = req.body;
            //const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, password, isAdmin: false });
            await user.save();
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred.' });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username, password });

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password.' });
            }

            req.session.user = user;

            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred.' });
        }
    },

    async logout (req, res) {
        req.session.destroy();
        res.redirect('/shop');
    },
    // profile(req, res) {
    //     //... your profile logic
    // }
};

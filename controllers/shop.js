const index = async(req, res) => {
    //Example: use this as an insparation
    // const products = await Product.find({})
    res.render("../views/shop.ejs", {username: req.session.user?.username});
}

module.exports =  {
    index
};

const index = async(req, res) => {
    //Example: use this as an insparation
    // const products = await Product.find({})
    res.render("../views/shop.ejs", {almog: "Linoy"});
}

module.exports =  {
    index
};
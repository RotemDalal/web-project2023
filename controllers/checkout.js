
const index = async(req, res) => {
    res.render("../views/checkout.ejs", {username: req.session.user?.username,isAdmin:req.session.user?.isAdmin});
}

module.exports =  {
    index
};
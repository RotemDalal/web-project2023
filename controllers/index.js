
const index = async(req, res) => {
    res.render("../views/index.ejs", {username: req.session.user?.username,isAdmin:req.session.user?.isAdmin});
}

module.exports =  {
    index
};
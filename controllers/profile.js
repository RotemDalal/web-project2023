
const index = async(req, res) => {
    if(!req.session.user) return res.redirect("/");
    res.render("../views/profile.ejs", {username: req.session.user?.username});
}

module.exports =  {
    index
};
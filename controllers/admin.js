
const index = async(req, res) => {
    if(!req.session.user) return res.redirect("/index.html");
    res.render("../views/admin.ejs", {username: req.session.user?.username});
}

const isAdmin = 

module.exports =  {
    index
};
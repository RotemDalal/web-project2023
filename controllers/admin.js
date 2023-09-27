
const index = async(req, res) => {
    if(!req.session.user) return res.redirect("/");
    res.render("../views/admin.ejs", {username: req.session.user?.username,isAdmin:req.session.user?.isAdmin});
}

module.exports =  {
    index
};
/*קוד זה בודק אם אין הפעלת משתמש (כלומר, המשתמש אינו מחובר), ואם כן, הוא מפנה את המשתמש לנתיב הבסיס ("/").*/
const FB = require('fb');
const { isAdmin, admin } = require('../controllers/usercontroller');
FB.setAccessToken(process.env.FB_ACCESS_TOKEN ?? 'EAAMKG69evoIBO9dazEIuUUcQ1W6xy1ZB2lUhbGqtuXzKocdE0CN0Mw2RM6sBxu5xRnNs6G4mn5xhGvANJ00MKZA36ZBc5oXwWTihpI5ZAV5pwZAnSYBQZAwczaxKiaWnaipJQdWxcemZAAsaZA5eugw1OMrahuFxGZCIv7M4cO4pTDv6Aseepg1ZC4ZAy7FoJOFPdkcfxVmyHRJT0Ki42Xnj0hzswCszB9IlhNhIoifnzBA');

const postToFB = async (req, res) => {
    if (!isAdmin) return res.redirect("/index");
    const { message } = req.body;
    FB.api(
        'me/feed',
        'POST',
        { "message": message },
        function (response) {
            if (response.error) {
                console.log('error occurred: ' + response.error.message)
                res.status(500).send('Internal Server Error While Trying To Post To Facebook');
                return;
            }
            console.log('successfully posted to page!');
            res.json(response);
        }
    );
}
const getDetails = async (req, res) => {
    if (!isAdmin) return res.redirect("/index");
    FB.api('me', function (fbResp) {
        if(!fbResp || fbResp.error) {
         console.log(!fbResp ? 'error occurred' : fbResp.error);
         fbResp.status(500).send('Internal Server Error');
         return;
        }
        res.json({ id: fbResp.id, name: fbResp.name });
      });


}
module.exports = {
    postToFB,
    getDetails
};
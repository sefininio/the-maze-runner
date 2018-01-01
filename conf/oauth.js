module.exports = {
    google: {
        client_id: '783888098632-c2ql2kcjban66frt3ho01mh2tdsjem9k.apps.googleusercontent.com',
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://127.0.0.1:3000/auth/google/callback',
    },
    facebook: {
        client_id: '302981996863433',
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: 'http://127.0.0.1:3000/auth/facebook/callback',
    },
    github: {
        client_id: '421f8b71254c45dcedd2',
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: 'http://127.0.0.1:3000/auth/github/callback',
    },
};

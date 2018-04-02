module.exports = {
    google: {
        client_id: '783888098632-ankoa7me1knjtr9hfecbu5e1v387v3nl.apps.googleusercontent.com',
        project_id: 'maze-runner-158820',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://127.0.0.1:3000/auth/google/callback',
    },
    facebook: {
        client_id: '783888098632-ankoa7me1knjtr9hfecbu5e1v387v3nl.apps.googleusercontent.com',
        project_id: 'maze-runner-158820',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        redirect_uri: 'http://127.0.0.1:3000/auth/google/callback',
    },
    github: {
        client_id: '783888098632-ankoa7me1knjtr9hfecbu5e1v387v3nl.apps.googleusercontent.com',
        project_id: 'maze-runner-158820',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://accounts.google.com/o/oauth2/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: 'http://127.0.0.1:3000/auth/google/callback',
    },
};

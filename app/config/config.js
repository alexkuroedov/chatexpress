const config = {
    herokuHttps: 'https://warm-plains-13717.herokuapp.com/ ',
    herokuHttp: 'http://warm-plains-13717.herokuapp.com/ ',
}

if (process.env.NODE_ENV === "production") {
    //for Heroku
        config.port = process.env.PORT;

} else {
        config.port = 3200 
}


module.exports = config; 
config = {
    herokuHttps: 'https://limitless-stream-38181.herokuapp.com/ ',
    herokuHttp: 'http://limitless-stream-38181.herokuapp.com/ ',
}

if (process.env.NODE_ENV === "production") {
    //for Heroku
        config.port = process.env.PORT;

} else {
        config.port = 3200 
}


module.exports = config;
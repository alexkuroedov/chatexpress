const express = require('express')
const path = require('path')
const http = require('http')
const socketIO = require('socket.io')
const users = require('./users')()
const config = require('../config/config')

// const port = process.env.PORT || 3200
const port = config.port
const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const message = (name, text, id) => {
    return {name, text, id}
}



app.use(express.static(publicPath))

io.on('connection', socket => {

    socket.on('join', (user, callback) => {
        if(!user.name || !user.room){
            return callback('Error: not valid user data')
        }else{

            callback({userId: socket.id})
            socket.join(user.room)

            users.remove(socket.id)
            users.add(socket.id, user.name, user.room)

            io.to(user.room).emit('users:update', users.getByRoom(user.room))
            socket.emit('message:new', message('Admin', `Welcome, ${user.name}`))
            socket.broadcast.to(user.room).emit('message:new', message('Admin', `${user.name} joined.`))

        }
    })

    socket.on('message:create', (data, callback) => {
        if(!data){
            callback(`Error: Message can't be empty`)
        }else{
            const user = users.get(socket.id)
            if(user){
                io.to(user.room).emit('message:new', message(data.name, data.text, data.id))
            }
            callback()
        }
    })

    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if(user){
            io.to(user.room).emit('message:new', message('Admin', `${user.name} left.`))
            io.to(user.room).emit('users:update', users.getByRoom(user.room))

        }
    })
})

server.listen(port,() => {
    console.log(`Server Up on port ${port}`)
})


//for Heroku not sleep
const https = require("https");
setInterval(function() {
    https.get(config.herokuHttps, (result) => {
        console.log('get https!')
    });

    http.get(config.herokuHttp, (result)=> {
        console.log('get http!')
    })
}, 300000); // every 5 minutes (300000)

const express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    })

server.listen(5555, () => {
    console.log('listening on *:5555')
})

io.on('connection', socket => {
    socket.on('set_brush_size', size_percentage => {
        // console.log("got message")
        io.emit('react_brush_size', size_percentage)
    })

    socket.on('set_cursor_position', cur_pos_percentage => {
        io.emit('react_cursor_position', cur_pos_percentage)
    })

    socket.on('enable_drawing', enable => {
        io.emit('react_draw', enable)
    })
})
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
    const smoothingFactor = 0.2
    const data = { touch: -1, pressure: 0, hovering: 0 } // rAcc. are relative values of acceleration
    socket.on('raw_data', rawData => {
        const [ touchZone, pressurePercent, hoveringD1, hoveringD2, hoveringD3, accX, accY, accZ ] = rawData.split(',')         

        // smoothing data
        data.touch = touchZone
        data.pressure = data.pressure + smoothingFactor * (pressurePercent - data.pressure)
        data.hovering = data.hovering + smoothingFactor * (hoveringD3 - data.hovering)

        socket.broadcast.emit("set_pressure", data.pressure)
        socket.broadcast.emit("set_hovering", data.hovering)
    })
})
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

    smoothingFactor = 0.2
    data = { touch: -1, pressure: 0, hovering: 0, accX: 0, accY: 0, accZ: 0 } // probably need to add Z too
    socket.on('raw_data', rawData => {
        const [ touchZone, pressurePercent, hoveringD1, hoveringD2, hoveringD3, accX, accY, accZ ] = rawData.split(',')         

        // smoothing data
        data.touch = touchZone
        data.pressure = data.pressure + smoothingFactor * (pressurePercent - data.pressure)
        data.hovering = data.hovering + smoothingFactor * (hoveringD1 - data.hovering)
        data.accX = data.accX + smoothingFactor * (accX - data.accX)
        data.accY = data.accY + smoothingFactor * (accY - data.accY)
        data.accZ = data.accZ + smoothingFactor * (accZ - data.accZ)
        // notSmoothed = { pressurePercent, hoveringD1, accX, accY}
        // if(hoveringD1 > 90)
        //     console.log({ pressurePercent, hoveringD1, accX, accY }, data)
        // console.log(data)
        // socket.broadcast.emit("react_brush_opacity", data.pressure)
        socket.broadcast.emit("react_cursor_move", { x: - data.accX / 1000., y: data.accZ / 1000. })
    })

    /** OUTDATED **/
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
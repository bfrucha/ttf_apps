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
    data = { touch: -1, pressure: 0, hovering: 0, accX: 0, accY: 0, accZ: 0, rAccX: 0, rAccY: 0, rAccZ: 0 } // rAcc. are relative values of acceleration
    socket.on('raw_data', rawData => {
        const [ touchZone, pressurePercent, hoveringD1, hoveringD2, hoveringD3, accX, accY, accZ ] = rawData.split(',')         

        // smoothing data
        data.touch = touchZone
        data.pressure = data.pressure + smoothingFactor * (pressurePercent - data.pressure)
        data.hovering = data.hovering + smoothingFactor * (hoveringD1 - data.hovering)
        const newAcc = { x: data.accX + smoothingFactor * (accX - data.accX),
                         y: data.accY + smoothingFactor * (accY - data.accY),
                         z: data.accZ + smoothingFactor * (accZ - data.accZ) }
        const diffAcc = { x: newAcc.x - data.accX, y: newAcc.y - data.accY, z: newAcc.z - data.accZ }
        data.accX = newAcc.x
        data.accY = newAcc.y
        data.accZ = newAcc.z
        data.rAccX = diffAcc.x
        data.rAccY = diffAcc.y
        data.rAccZ = diffAcc.z

        // check this algorithm to get 3D position from IMU and Gyro (orientation) data
        // https://tinyurl.com/3hhvmvwf
        // comes from this example: https://x-io.co.uk/oscillatory-motion-tracking-with-x-imu/

        // notSmoothed = { pressurePercent, hoveringD1, accX, accY}
        // if(hoveringD1 > 90)
        //     console.log({ pressurePercent, hoveringD1, accX, accY }, data)
        // console.log(data)
        // socket.broadcast.emit("react_brush_opacity", data.pressure)
        socket.broadcast.emit("react_cursor_move", { x: data.rAccZ / 10., y: data.rAccY / 10. })
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
const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', client => {
  client.on('set_pressure', pressure_value => {
    console.log("New pressure value: " + pressure_value)
  });
});

server.listen(3000);

import socketio
from time import sleep

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://localhost:3000')

while True:
    x = input("\nEnter number for pressure: ")
    try:
        pressure_value = int(x)
        sio.emit("set_pressure", pressure_value)
        sleep(0.5)
    except ValueError:
        print("Not an integer value")

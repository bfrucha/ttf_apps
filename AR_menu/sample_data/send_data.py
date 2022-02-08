import pandas as pd
import socketio
from time import sleep

sio = socketio.Client()

@sio.event
def connect():
	print('connection established')

	df = pd.read_csv("sample_data.csv")

	# read all lines and send them to the web appc
	for index, row in df.iterrows():
		line = str(list(row))[1:-1]
		line = line.replace(" ", "")
		sio.emit("raw_data", line)
		sleep(0.01)

# @sio.event
# def disconnect():
#     print('disconnected from server')

sio.connect('http://localhost:5555')


# df = pd.read_csv("sample_data.csv")

# print(df["AccY"].describe())
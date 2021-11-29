import React from 'react'
import { io } from 'socket.io-client'

export default class TestSocketIO extends React.Component {

    mouseDown = false

    constructor(props) {
        super(props);

        this.socket = io("http://localhost:5555")
    }

    onKeyUp = (ke) => {
        if(ke.key === "Enter") {
            this.socket.emit("set_cursor_position", { x: ke.currentTarget.value, y: ke.currentTarget.value })
        }
    }

    onMouseDown = () => {
        if(!this.mouseDown) this.socket.emit("enable_drawing", true)
        this.mouseDown = true
    }

    onMouseUp = () => {
        if(this.mouseDown) this.socket.emit("enable_drawing", false)
        this.mouseDown = false
    }

    onMouseMove = (me) => {
        const dim = me.currentTarget.getBoundingClientRect()
        this.socket.emit("set_cursor_position", { x: (me.clientX - dim.left)/dim.width, y: (me.clientY - dim.top)/dim.height })
    }

    render() {
        return (
            <div>
                <input onKeyUp={this.onKeyUp}/>
                <div onMouseMove={this.onMouseMove}
                     onMouseDown={this.onMouseDown}
                     onMouseUp={this.onMouseUp}
                    style={{ width: '50px', height: '50px', border: "1px solid black" }}/>
            </div>
        )
    }
}
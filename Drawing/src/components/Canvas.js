import React from 'react'
import { Tool } from '../App'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrush, faEraser, faCircle } from '@fortawesome/free-solid-svg-icons'
import App from "../App";

const ToolIcons = React.memo((props) => {
    return (
        <div className={"tool-icons"}>
            <FontAwesomeIcon icon={faBrush} className={"icon" + ((props.tool === Tool.Brush)?" selected":"")}/>
            <FontAwesomeIcon icon={faEraser} className={"icon" + ((props.tool === Tool.Eraser)?" selected":"")}/>
        </div>
    )
})

const ToolOptions = React.memo((props) => {
    console.log(props)
    return (
        <div className={"tool-options"}>
            <p>Size: {props.size}px</p>
            <p>Opacity: {props.opacity}%</p>
            { props.color && <p>Color: <FontAwesomeIcon icon={faCircle} style={{color: props.color}}/></p>}
        </div>
    )
})


export default class    Canvas extends React.Component {
    drawingCanvas = React.createRef()

    componentDidMount() {
        const dCanvas = this.drawingCanvas.current
        dCanvas.setAttribute("width", dCanvas.getBoundingClientRect().width)
        dCanvas.setAttribute("height", dCanvas.getBoundingClientRect().height)
    }

    componentDidUpdate() {
        if(!this.props.toolActivated) return

        const { cursorPosition, toolOptions, tool } = this.props
        const canvas = this.drawingCanvas.current
        const context = canvas.getContext("2d")
        console.log('draw')
        context.globalAlpha = toolOptions.opacity/100
        if(tool === Tool.Brush) {
            // context.globalCompositeOperation = 'source-over'
            context.fillStyle = toolOptions.color
            context.beginPath()
            context.arc(cursorPosition.x, cursorPosition.y, toolOptions.size, 0, Math.PI*2)
            context.fill()
        } else if(tool === Tool.Eraser) {
            // context.globalCompositeOperation = 'destination-out'
            context.beginPath()
            context.fillStyle = 'white'
            context.arc(cursorPosition.x, cursorPosition.y, toolOptions.size, 0, Math.PI*2)
            context.fill()
        }
    }

    handleWheelEvents = (we) => {
        const { toolOptions } = this.props
        const size = Math.min(30, Math.max(2, toolOptions.size + (we.deltaY>0?-1:1)))
        this.props.updateToolProps({ options: { size: size } })
    }

    handleKeyUp = (ke) => {
        if(ke.key === "t") {
            this.props.updateToolProps({ tool: (this.props.tool+1) % Object.keys(Tool).length })
        } else if(ke.key === "-") {
            const opacity = Math.min(100, Math.max(0, this.props.toolOptions.opacity-10))
            this.props.updateToolProps({ options: { opacity: opacity } })
        } else if(ke.key === "+") {
            const opacity = Math.min(100, Math.max(0, this.props.toolOptions.opacity+10))
            this.props.updateToolProps({ options: { opacity: opacity } })
        }
    }

    render() {
        const { cursorPosition, toolOptions } = this.props
        return (
            <React.Fragment>
                <canvas ref={this.drawingCanvas} id={"drawing-canvas"}
                    width={this.props.width} height={this.props.height}/>
                <svg id={"cursor-canvas-svg"} tabIndex={0}
                     width={this.props.width} height={this.props.height}
                     onMouseDown={() => this.props.updateToolProps({ toolActivated: true })}
                     onMouseMove={(me) => this.props.updateToolProps({ cursorPosition: {x: me.nativeEvent.offsetX, y: me.nativeEvent.offsetY} }) }
                     onMouseUp={() => this.props.updateToolProps({ toolActivated: false })}
                     onMouseLeave={() => this.props.updateToolProps({ toolActivated: false })}
                     onWheel={this.handleWheelEvents}
                     onKeyUp={this.handleKeyUp}>
                    <ellipse id={"tool-cursor"} cx={cursorPosition.x} cy={cursorPosition.y} rx={toolOptions.size}/>
                </svg>
                <ToolIcons tool={this.props.tool}/>
                <ToolOptions {...this.props.toolOptions}/>
            </React.Fragment>
        )
    }
}
import './css/index.css'
import Canvas from "./components/Canvas";
import React from 'react'
import _ from 'lodash'

export const Tool = {
    Brush: 0,
    Eraser: 1
}
const defaultToolOptions = {}
defaultToolOptions[Tool.Brush] = { opacity: 100, size: 5, color: "#aaef21" }
defaultToolOptions[Tool.Eraser] = { opacity: 100, size: 5 }

export default class App extends React.Component {
    state = {
        tool: Tool.Brush,
        toolOptions: defaultToolOptions,
        toolActivated: false,
        cursorPosition: { x: 0, y: 0 }
    }

    handleToolEvents = (props) => {
        const currentOptions = _.cloneDeep(this.state.toolOptions)
        if(props.options) {
            const options = currentOptions[this.state.tool]
            if(props.options.opacity) options.opacity = props.options.opacity
            if(props.options.size) options.size = props.options.size
            if(props.options.color) options.color = props.options.color
            delete props.options
        }
        // random color on Brush selection
        if(props.tool === Tool.Brush) {
            console.log(props.tool)
            const colors = new Array(3).fill(0).map(() => {
                const number = Math.floor(Math.random()*256)
                const s = (number<16?"0":"")+number.toString(16)
                return s
            })
            currentOptions[props.tool].color = "#"+colors.join('')
            console.log(currentOptions.color)
        }
        this.setState({ toolOptions: currentOptions })
        this.setState(props)
    }

    render() {
        const { tool, toolOptions, toolActivated, cursorPosition } = this.state
        return (
            <div className="container">
                <Canvas tool={tool} toolOptions={toolOptions[tool]} toolActivated={toolActivated} cursorPosition={cursorPosition}
                    updateToolProps={this.handleToolEvents}/>
            </div>
        )
    }
}

import './css/index.css'
import PressureMenu from "./components/PressureMenu";
import React from 'react'

export default class App extends React.Component {
    state = {
        pressureApplied: 0
    }
    pressureOn = false
    pressureStep = 2
    intervalID = null
    maxPressure = 1000

    applyPressure = (ke = null, pressure = null) => {
        if(ke && ke.key !== "p") return
        // accelerate pressure when keep pressing
        if(!this.pressureOn) {
            if(this.intervalID) clearInterval(this.intervalID)
            this.intervalID = setInterval(() => { this.pressureStep *= 2 }, 500)
        }
        this.pressureOn = true
        const newPressure = pressure ?? Math.min(this.state.pressureApplied + this.pressureStep, this.maxPressure)
        this.setState({ pressureApplied: newPressure })
    }

    releasePressure = (ke) => {
        if(ke.key !== "p") return
        // release pressure little by little
        if(this.pressureOn) {
            if(this.intervalID)  {
                clearInterval(this.intervalID)
                this.pressureStep = 2
            }
            this.intervalID = setInterval(() => {
                const pressure = this.state.pressureApplied - 4
                if(pressure <= 0) clearInterval(this.intervalID)
                this.setState({ pressureApplied: pressure })
            }, 15)
        }
        this.pressureOn = false
    }

    menuSelected() {
        if(this.intervalID) clearInterval(this.intervalID)
        this.pressureOn = false
        this.applyPressure(null, 0.01)
    }

    render() {
        return (
            <div className="container">
                <svg id={"svg-canvas"} tabIndex={0}
                    onKeyPress={this.applyPressure}
                    onKeyUp={this.releasePressure}>
                    <PressureMenu
                        currentPressure={this.state.pressureApplied/this.maxPressure}
                        menuSelected={() => this.menuSelected()}/>
                </svg>
            </div>
        )
    }
}

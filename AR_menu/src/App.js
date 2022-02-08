import './index.css'
import PressureMenu from "./components/PressureMenu";
import React from 'react'
import { io } from "socket.io-client"
import menuStructure from "./data/menu_structure.json"


export default class App extends React.Component {
    state = {
        menuIDFocused: null, // first focus before can be selected by validating with hover interaction
        menuIDSelected: null,
        itemIDFocused: null,
        itemSelected: null,
        pressureApplied: 0,
        hoveringDistance: 0
    }

    focusTimeoutID = null
    tmpMenuIDFocused = null
    tmpItemIDFocused = null

    hoverThreshold = 65  // threshold beyond which user can validate a selection
    hoverTimeoutID = null

    socket = null

    constructor(props) {
        super(props)
        this.socket = io("http://localhost:5555/")
    }

    componentDidMount() {
        const menuInterval = 100./menuStructure.length  // interval of values belonging to that menu
        this.socket.on("set_pressure", pressurePerc => {
            const { menuIDSelected } = this.state
            if(pressurePerc > 5) {  // below 5% pressure we don't consider values for menu selection
                if(menuIDSelected === null) {  // no menu selected, so we deal with the roots
                    const menuID = Math.floor(pressurePerc / menuInterval)  // gives us the menu ID focused by the current pressure level
                    // console.log(menuID, this.tmpMenuIDFocused)
                    if(this.tmpMenuIDFocused === null || this.tmpMenuIDFocused !== menuID) {
                        this.tmpMenuIDFocused = menuID
                        clearTimeout(this.focusTimeoutID)
                        this.focusTimeoutID = setTimeout(() => {
                            this.tmpMenuIDFocused = null
                            this.setState({ menuIDFocused: menuID })
                        }, 1000)
                    }
                }
                else {  // a menu is selected, so we deal with the children
                    const itemInterval = 100./menuStructure[this.state.menuIDSelected].children.length
                    const itemID = Math.floor(pressurePerc / itemInterval)  // gives us the menu ID focused by the current pressure level
                    // console.log(itemID, this.tmpItemIDFocused)
                    if(this.tmpItemIDFocused === null || this.tmpItemIDFocused !== itemID) {
                        this.tmpItemIDFocused = itemID
                        clearTimeout(this.focusTimeoutID)
                        this.focusTimeoutID = setTimeout(() => {
                            this.tmpItemIDFocused = null
                            this.setState({ itemIDFocused: itemID })
                        }, 1000)
                    }
                }
            } else {
                if(this.focusTimeoutID) clearTimeout(this.focusTimeoutID)
            }

            this.setState({ pressureApplied: pressurePerc })
        })

        this.socket.on("set_hovering", absHover => {
            this.setState({ hoveringDistance: absHover })

            // selects focused menu or item if hover distance remains above a given threshold for 1s
            if(absHover > this.hoverThreshold) {  // just for testing, need to add delay
                this.selectCurrentFocus()
            }
        })
    }

    selectCurrentFocus = () => {
        const { menuIDFocused, menuIDSelected, itemIDFocused } = this.state
        if(itemIDFocused !== null) {
            console.log(menuIDFocused, menuIDSelected, itemIDFocused)
            const itemName = menuStructure[menuIDSelected].name + " > " +menuStructure[menuIDSelected].children[itemIDFocused]
            this.setState({ ...this.state, menuIDFocused: null, menuIDSelected: null, itemIDFocused: null, itemSelected: itemName, pressureApplied: 0 })
            setTimeout(() => {
                const { itemSelected } = this.state
                if(itemName === itemSelected) this.setState({ ...this.state, itemSelected: null })
            }, 3000)
        }
        else if(menuIDFocused !== null) {
            this.setState({ ...this.state, menuIDFocused: null, menuIDSelected: menuIDFocused, pressureApplied: 0 })
        }
    }

    keyUp = (ke) => {
        if(ke.key === "v") this.selectCurrentFocus()
    }

    render() {
        return (
            <div className="container" tabIndex="0"
                onKeyUp={this.keyUp}>
                <PressureMenu
                    currentPressure={this.state.pressureApplied/this.maxPressure}
                    {...this.state}/>
                { this.state.itemSelected !== null && (
                    <div id="selection-results">
                        Item selected: { this.state.itemSelected ?? "..." }
                    </div>
                )}
                <div id="input-feedback">
                    <div className="pressure">
                        Pressure
                        <div className="slider-box">
                            <div className="target" style={{ top: 0 }}>
                                <span>100%</span>
                            </div>
                            <div className="slider" style={{height: this.state.pressureApplied}}/>
                        </div>
                    </div>
                    <div className="hovering">
                        Hovering
                        <div className="slider-box">
                            <div className="target" style={{ bottom: this.hoverThreshold+"%" }}>
                                <span>{ this.hoverThreshold+"mm" }</span>
                            </div>
                            <div className="slider" style={{height: this.state.hoveringDistance}}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

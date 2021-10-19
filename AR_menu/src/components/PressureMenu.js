import React from 'react'
import menuStructure from '../data/menu_structure.json'

const PressureBar = (props) => {
    return (
        <rect id={"pressure-bar"} {...props}></rect>
    )
}

const MenuItem = (props) => {
    return (
        <g className={"menu-item" + (props.selected?" selected":"")}>
            <rect x={props.x} y={props.y} width={props.w} height={props.h}/>
            <text x={props.x + props.w/2} y={props.y + props.h*0.6}>{props.label}</text>
        </g>
    )
}

export default class PressureMenu extends React.Component {
    state = {
        menuSelectedID: null,
        itemSelectedID: null
    }
    itemSize = { width: 150, height: 50 }
    // select item after given timeout
    timeoutID = null
    currentTarget = null

    renderMenuStructure() {
        const startX = 30, startY = 15, stepY = this.itemSize.height
        let menuItems = menuStructure.map((el, i) => {
            const props = { x: startX, y: startY + stepY*i, w: this.itemSize.width, h: this.itemSize.height, label: el.name, selected: this.state.menuSelectedID === i}
            return <MenuItem {...props} key={el.name}/>
        })
        if(this.state.menuSelectedID !== null) {
            const csX = startX + this.itemSize.width + 20, csY = startY + this.itemSize.height * this.state.menuSelectedID
            const children = menuStructure[this.state.menuSelectedID].children.map((el, i) => {
                const props = { x: csX, y: csY + stepY*i, w: this.itemSize.width, h: this.itemSize.height, label: el, selected: this.state.itemSelectedID === i }
                return <MenuItem {...props} key={el}/>
            })
            menuItems = menuItems.concat(children)
        }
        return menuItems
    }

    componentDidUpdate() {
        if(this.props.currentPressure <= 0) {
            if(this.timeoutID) clearTimeout(this.timeoutID)
            if(this.state.menuSelectedID !== null) this.setState({ menuSelectedID: null, itemSelectedID: null })
            return
        }
        const cardinality = this.state.menuSelectedID===null?menuStructure.length:menuStructure[this.state.menuSelectedID].children.length
        const targetID = Math.floor(this.props.currentPressure * cardinality)
        if(targetID !== this.currentTarget) {
            if(this.timeoutID) clearTimeout(this.timeoutID)
            this.currentTarget = targetID
            this.timeoutID = setTimeout(() => {
                this.timeoutID = null
                if(this.state.menuSelectedID === null) {
                    this.setState({ menuSelectedID: this.currentTarget })
                    this.props.menuSelected()
                }
                else this.setState({ itemSelectedID: this.currentTarget })
            }, 1000)
        }
    }

    render() {
        const pressBarProps = { x: 15, y: 15, width: 12 }
        let maxHeight = menuStructure.length*this.itemSize.height
        if(this.state.menuSelectedID !== null) {
            pressBarProps.x += this.itemSize.width + 20
            pressBarProps.y += this.itemSize.height * this.state.menuSelectedID
            maxHeight = menuStructure[this.state.menuSelectedID].children.length * this.itemSize.height
        }
        pressBarProps.height = maxHeight * this.props.currentPressure
        return (
            <React.Fragment>
                <PressureBar {...pressBarProps}/>
                { this.renderMenuStructure() }
            </React.Fragment>
        )
    }
}
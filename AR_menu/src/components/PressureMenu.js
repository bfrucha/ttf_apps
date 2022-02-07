import React from "react"
import menuStructure from "../data/menu_structure.json"

export default class PressureMenu extends React.Component {

    renderMenus() {
        const { menuIDFocused, menuIDSelected, itemIDFocused, pressureApplied } = this.props
        const pressureFeedback = <div className="pressure-feedback" style={menuIDSelected===null?{width: pressureApplied+"%"}:{height:pressureApplied+"%"}}/>

        const roots = menuStructure.map((menu, mi) =>
            <div key={menu.name} className={"root" + (menuIDFocused === mi?" focused":"") + (menuIDSelected === mi?" selected":"")}>
                {menu.name}
                <div className={"children" + (menuIDSelected === mi?" visible":"")}>
                    { menuIDSelected !== null && pressureFeedback }
                    { menu.children.map((child, ii) => <div className={"child" + (menuIDSelected===mi && itemIDFocused === ii?" focused":"")} key={menu.name+"-"+child}>{ child }</div>) }
                </div>
            </div>
        )
        return (
            <div className="roots">
                { menuIDSelected === null && pressureFeedback }
                { roots }
            </div>
        )
    }


    render() {
        return (
            <div id="pressure-menu">
                { this.renderMenus() }
            </div>
        )
    }
}
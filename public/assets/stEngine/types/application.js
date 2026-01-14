import { Shapes } from "../inc/inc.js"
import System from "../system.js"

export default class Application extends System{
    constructor({customTags = {}, isUpdate = false, timerStamp = 2000}){
        super({timerStamp, isUpdate})
        if(Object.keys(customTags).length > 0){
            for (const [key, elementClass] of Object.entries(customTags)){
                let final_key = (!key.includes("-")) ? `${key.trim()}-tag` : key.trim()
                customElements.define(final_key, elementClass)
            }
        }
    }

    render({url, container}, callback = null){
        if(!container || !url) return null
        const result = fetch(url).then(response => { return response.text() })
        const getResult = (async () => {
            container.innerHTML = await result
            if(callback !== null) callback(container)
        })()
    }

    screen(name, state = "open"){
        const screen = document.querySelector(`.screen-element[name='${name}']`)
        if(typeof state == "boolean"){ state = state ? "open" : "close" }
        if(screen) screen.setAttribute("data-state", state)
        return screen
    }

    create({element = "div", classname = "", id = "", src = "", alt = "", data = "", type = "", attr = {}, parent = null, textContent = null, append = true}){
        return Shapes.HTML({element, classname, id, src, alt, data, type, attr, parent, textContent, append})
    }
}

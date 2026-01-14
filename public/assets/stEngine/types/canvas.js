import System from "../system.js"

export default class Canvas extends System{
    /**
     * canvasid = "canvas"
     * @param {{canvasid?:string, width?:number, height?:number, autostart?:boolean, autorefresh?:boolean}} 
     */
    constructor({canvasid = "canvas", width = null, height = null, autorefresh = true, isUpdate = true, timerStamp = 50}){
        super({isUpdate, timerStamp})
        this.canvas = document.getElementById(canvasid)
        this.autorefresh = autorefresh
        if(this.canvas){
            if(this.canvas.tagName === "CANVAS"){
                this.context = this.canvas.getContext('2d')
                this.canvas.width = (width) ? width : innerWidth
                this.canvas.height = (height) ? height : innerHeight
                this.canvasSize = {w: this.canvas.width, h: this.canvas.height}
            }
            else{
                this.context = null
                this.canvas.style.width = (width) ? width+"px" : "100vw"
                this.canvas.style.height = (height) ? height+"px" : "100vh"
                this.canvasSize = {w: this.canvas.style.width, h: this.canvas.style.height}
            }
        }
    }

    getContext(){ return this.context }
    getCanvas(){ return this.canvas }
    getCanvasSize(){ return this.canvasSize }

    Update(){
        super.Update()
        if(this.context){
            if(this.autorefresh) this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
            this.Draw()
        }
    }

    Draw(){}
}
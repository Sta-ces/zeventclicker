export class Shapes{
    static Square(ctx, {x, y, w, h, fillColor, strokeColor, strokeWidth = 0}){
        if(fillColor) ctx.fillStyle = fillColor;
        if(strokeColor) ctx.strokeStyle = strokeColor;
        if(strokeWidth) ctx.lineWidth = strokeWidth;
        ctx.fillRect(x, y, w, h);
        if(strokeWidth > 0 || strokeColor) ctx.strokeRect(x, y, w, h);
    }

    static Circle(ctx, {x, y, r, startAngle = 0, endAngle = 2 * Math.PI, fillColor, strokeColor, strokeWidth = 0}){
        if(fillColor) ctx.fillStyle = fillColor;
        if(strokeColor) ctx.strokeStyle = strokeColor;
        if(strokeWidth) ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.arc(x, y, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        if(strokeWidth > 0 || strokeColor) ctx.stroke();
    }

    static Star(ctx, {x, y, spikes = 5, outerRadius = 30, innerRadius = 15, fillColor, strokeColor, strokeWidth = 0}){
        let rot = Math.PI/2*3;
        let cx = x, cy = y;
        let step = Math.PI/spikes;

        if(fillColor) ctx.fillStyle = fillColor;
        if(strokeColor) ctx.strokeStyle = strokeColor;
        if(strokeWidth) ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(cx,cy-outerRadius);
        for(let i=0;i<spikes;i++){
            x=cx+Math.cos(rot)*outerRadius;
            y=cy+Math.sin(rot)*outerRadius;
            ctx.lineTo(x,y);
            rot+=step;
            x=cx+Math.cos(rot)*innerRadius;
            y=cy+Math.sin(rot)*innerRadius;
            ctx.lineTo(x,y);
            rot+=step;
        }
        ctx.lineTo(cx,cy-outerRadius);
        ctx.closePath();
        if(fillColor) ctx.fill();
        if(strokeWidth > 0 || strokeColor) ctx.stroke();
    }

    static Path(ctx, {curves, closePath = true, fillColor, strokeColor, strokeWidth = 0}){
        if(curves && curves.length > 0){
            if(fillColor) ctx.fillStyle = fillColor;
            if(strokeColor) ctx.strokeStyle = strokeColor;
            if(strokeWidth) ctx.lineWidth = strokeWidth;
            ctx.beginPath();
            ctx.moveTo(curves[0].x, curves[0].y);
            for (let c = 1; c < curves.length; c++) {
                const curve = curves[c];
                ctx.lineTo(curve.x, curve.y);
            }
            if(closePath) ctx.closePath();
            if(fillColor) ctx.fill();
            if(strokeWidth > 0 || strokeColor) ctx.stroke();
        }
    }

    static HTML({element = "div", classname = "", id = "", src = "", alt = "", data = "", type = "", attr = {}, parent = null, textContent = null, append = true}){
        const el = document.createElement(element)
        if(classname !== "") el.setAttribute("class", classname)
        if(id !== "") el.setAttribute("id", id)
        if(src !== "") el.setAttribute("src", src)
        if(data !== "") el.setAttribute("data", data)
        if(type !== "") el.setAttribute("type", type)
        if(alt !== "") el.setAttribute("alt", alt)
        if(Object.keys(attr).length > 0){
            for(const [key, value] of Object.entries(attr))
                el.setAttribute(key, value)
        }
        if(textContent) el.innerHTML = textContent
        if(parent && append) parent.append(el)
        return el
    }
}

export class BaseElement extends HTMLElement{
    constructor(){
        super();

        this.options = {
            attributes: true,
            childList: true
        };
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if(mutation.type == "attributes"){
                    console.log("Attribute changed");
                    this.attributesChanged(mutation, mutation.attributeName);
                }
            });
        });
    }

    getStyle(css, importUrl = ""){
        if(typeof css != "string"){
            console.error("Style type error");
            return;
        }

        let style = document.createElement('style');
        let importCSS = (importUrl !== "") ? `@import url('${importUrl}');` : "";
        style.textContent = importCSS + css.replaceAll(" ", "").trim();
        return style;
    }
    
    connectedCallback(){
        this.observer.observe(this, this.options);
        this.Awake();
    }

    getAttr(attr, defaultValue = ""){
        return (this.hasAttribute(attr)) ? this.getAttribute(attr) : defaultValue;
    }

    setAttr(attr, value, forced = false){
        if(this.hasAttribute(attr) || forced){
            this.setAttribute(attr, value);
        }
    }

    attributesChanged(attr, name){
        if(attr == null || name == null){
            console.error("Attributes error");
            return;
        }
    }

    create({element = "div", classname = "", id = "", src = "", alt = "", data = "", type = "", attr = {}, parent = this, textContent = null, append = true}){
        return Shapes.HTML({element, classname, id, src, alt, data, type, attr, parent, textContent, append})
    }

    Awake(){}
}

export class Timer {
    constructor(callback, time = 1000){
        this.time = time
        this.callback = callback
        this.timerObject = setInterval(callback, time)
    }

    stop() {
        if (this.timerObject) {
            clearInterval(this.timerObject)
            this.timerObject = null
        }
        return this
    }

    start() {
        if (!this.timerObject) {
            this.stop()
            this.timerObject = setInterval(this.callback, this.time)
        }
        return this
    }

    reset(newTime = this.time) {
        this.time = newTime
        return this.stop().start()
    }

    isStart(){ return this.timerObject != null }
}

export class Chronometer {
    constructor({parent = null, duration, speed = 1000, play = true, reduce = 60, callback_display, callback_end = () => {}}){
        this.duration = duration
        this.parent = parent
        this.callback_display = callback_display
        this.callback_end = callback_end
        this.play = play
        
        this.CHRONOSTATE = new Timer(this.#chrono.bind(this), speed)
    }

    static converter(timestamp){
        let milliseconds = parseInt(timestamp % 60)
        let seconds = parseInt((timestamp / 60) % 60)
        let minutes = parseInt(((timestamp / 60) / 60) % 60)
        let hours = parseInt(((((timestamp / 60) / 60) / 24) % 24))

        hours = hours < 10 ? "0" + hours : hours
        minutes = minutes < 10 ? "0" + minutes : minutes
        seconds = seconds < 10 ? "0" + seconds : seconds
        milliseconds = milliseconds < 10 ? "0" + milliseconds : milliseconds

        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds,
            time: timestamp
        }
    }
    
    #chrono() {
        this.callback_display(Chronometer.converter(this.duration), this.parent)

        if(this.play) this.reduceDuration()

        if (this.duration < 0) {
            this.CHRONOSTATE.stop()
            this.callback_end(this.CHRONOSTATE, this.parent)
            this.play = false
        }
    }

    isPlay(){ return this.play }
    setPlay(play){ this.play = play }
    getDuration(){ return this.duration }
    reduceDuration(reduce = 60){ this.duration -= reduce }
}

export class SaveManager{
    static save(key, value){ localStorage.setItem(key, JSON.stringify(value)) }
    static load(key, default_value = []){
        if(!localStorage.getItem(key)) return default_value
        return JSON.parse(localStorage.getItem(key))
    }
    static remove(key){ localStorage.removeItem(key); }
}

export class JSONManager{
    constructor({pathfile, saverSystem}) {
        this.pathfile = pathfile;
        this.saverSystem = saverSystem;
        this.datas = {};
    }

    get(param) {
        if (this.datas.hasOwnProperty(param)) {
            return this.datas[param];
        } else {
            console.error(`The parameter "${param}" doesn't exist in the JSON file.`);
            return null;
        }
    }

    set(param, value){
        if (this.datas.hasOwnProperty(param)) {
            this.datas[param] = value;
        } else {
            console.error(`The parameter "${param}" doesn't exist in the JSON file.`);
        }
    }

    getDatas(){ return this.datas; }

    async load(){
        try {
            const reponse = await fetch(this.pathfile);
            this.datas = await reponse.json();
            console.log(`JSON file has loaded successfully from ${this.pathfile}`);
        } catch (erreur) {
            console.error(`Error during the JSON file load: ${erreur.message}`);
        }
    }

    async save(){
        try {
            const datasJSON = JSON.stringify(this.datas, null, 2);
            this._request({
                action: this.saverSystem,
                params: `datas=${datasJSON}&filename=${this.pathfile}`
            }, (res) => { console.log(res); })
        } catch (erreur) {
            console.error(`Error during the JSON file save: ${erreur.message}`);
        }
    }

    _request({action, params = "", method = "POST", type = "text/html"}, callback = () => {}) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (this.readyState === xhr.DONE && this.status === 200) callback(this.responseText)
        }
        xhr.open(method, action, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
        xhr.type = type
        xhr.send(params)
    }
}

export class Score{
    constructor(ini = 0, isNegative = false){
        this.ini = ini
        this.isNegative = isNegative
        this.score = ini
    }

    get(){ return this.score }
    set(point){
        this.score = parseFloat(point)
        this.#format()
        this.#checkNegative()
    }

    getScoreFormat(lang, options = {}){ return new Intl.NumberFormat(lang, options).format(this.score) }

    add(point = 1){
        this.score += point
        this.#format()
        this.#checkNegative()
    }
    remove(point = 1){
        this.score -= point
        this.#format()
        this.#checkNegative()
    }
    reset(){ this.score = this.ini }

    #checkNegative(){ if(!this.isNegative && this.score < 0) this.score = 0 }
    #format(){ this.score = Math.round(this.score) }
}

export class Statistics{
    constructor(){
        this.combo = 0
        this.maxcombo = 0
        this.success = 0
        this.errors = 0
    }

    getCombos(){ return this.combos }
    setCombos(comb){ this.combos = comb }
    addCombos(comb = 1){ this.combos += comb; this.setMaxCombo() }
    lessCombos(comb = 1){ this.combos -= comb }

    getMaxCombo(){ return this.maxcombo }
    setMaxCombo(){ if(this.combo > this.maxcombo) this.maxcombo = this.combo }

    getSuccess(){ return this.success }
    setSuccess(succ){ this.success = succ }
    addSuccess(succ = 1){ this.success += succ }
    lessSuccess(succ = 1){ this.success -= succ }

    getErrors(){ return this.errors }
    setErrors(err){ this.errors = err }
    addErrors(err = 1){ this.errors += err }
    lessErrors(err = 1){ this.errors -= err }
}

export class TypingStatistics extends Statistics{
    constructor(){
        super()
        this.findingWords = 0
        this.tappedLetter = 0
    }

    getFindingWords(){ return this.findingWords }
    addFindingWords(){ this.findingWords++ }
    getTappedLetter(){ return this.tappedLetter }
    addTappedLetter(){ this.tappedLetter++ }
}
import { Timer } from "./inc/inc.js"

export default class System{
    static GAMESTATE = { PLAY: "play", STOP: "stop", PAUSE: "pause", GAMEOVER: "gameover" }

    constructor({timerStamp = 50, isUpdate = true}){
        this.gamestate = System.GAMESTATE.PLAY
        this.timerStamp = timerStamp
        this.#_(isUpdate)
    }

    async #_(isUpdate = true){
        await this.Awake()
        await this.Start()
        this.timer = (isUpdate) ? new Timer(() => { this.Update() }, this.timerStamp) : null
    }

    getState(){ return this.gamestate }
    setState(state){ return this.gamestate = state }
    getTimerStamp(){ return this.timerStamp }
    setTimer(timer){
        this.timerStamp = timer
        this.timer?.reset(timer)
    }

    Awake(){}
    Start(){}
    Update(){
        switch(this.gamestate){
            case System.GAMESTATE.PLAY: this.Play(); break;
            case System.GAMESTATE.STOP: this.Stop(); break;
            case System.GAMESTATE.PAUSE: this.Pause(); break;
            case System.GAMESTATE.GAMEOVER: this.GameOver(); break;
        }
    }
    
    Play(){
        this.gamestate = System.GAMESTATE.PLAY
        this.timer?.start()
    }
    Stop(){
        this.gamestate = System.GAMESTATE.STOP
        this.timer?.stop()
    }
    Pause(){
        this.gamestate = System.GAMESTATE.PAUSE
        this.timer?.stop()
    }
    GameOver(){
        this.gamestate = System.GAMESTATE.GAMEOVER
        this.timer?.stop()
    }

    PlaySound({src, volume = 1}){
        let sound = new Audio();
        sound.src = src;
        sound.volume = Math.min(Math.max(volume,0),1)
        sound.play();
    }

    /** @return {boolean} */
    isPlay(){ return this.gamestate === System.GAMESTATE.PLAY; }
    /** @return {boolean} */
    isStop(){ return this.gamestate === System.GAMESTATE.STOP; }
    /** @return {boolean} */
    isPause(){ return this.gamestate === System.GAMESTATE.PAUSE; }
    /** @return {boolean} */
    isGameOver(){ return this.gamestate === System.GAMESTATE.GAMEOVER; }
}

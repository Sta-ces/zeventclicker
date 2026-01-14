export default class Info{
    constructor(infos){
        this.id = infos.id;
        this.name = infos.name;
        this.unlock = infos.unlock;
    }

    get getId(){ return this.id; }
    get getName(){ return this.name; }
    get getUnlock(){ return this.unlock; }
}
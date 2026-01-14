export default class Achievement{
    constructor(infoAchievement){
        super(infoAchievement);
        this.description = infoAchievement.description;
    }

    get getDescription(){ return this.description; }
    get getUnlockStreamers(){ return (this.unlock.hasOwnProperty("streamers")) ? this.unlock.streamers : []; }
    get getUnlockBonus(){ return (this.unlock.hasOwnProperty("bonus")) ? this.unlock.bonus : []; }
}
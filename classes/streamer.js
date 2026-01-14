export default class Streamer{
    constructor(infos){
        this.infos = infos;
        this.id = infos.id;
        this.name = infos.display_name || infos.name;
        this.slug = infos.login || infos.slug;
        this.image = infos.profile_image_url || infos.image;
        this.followers = parseInt(infos.followers/10);
        this.maxStamina = 100;
        this.stamina = this.maxStamina;
        this.sleep = false;
        this.isunlocked = false;
        this.isnightbirds = infos.nightbirds || infos.isnightbirds;
        this.ischaoslovers = infos.chaoslovers || infos.ischaoslovers;
        this.onplace = infos.hasOwnProperty("onplace") ? infos.onplace : true;
        this.type = infos.hasOwnProperty("type") ? infos.type : null;
        this.partners = infos.hasOwnProperty("partners") ? infos.partners : [];
    }

    reset(){
        this.resetStamina()
        this.setSleep(false)
        this.setUnlock(false)
    }

    getInfos(){ return this.infos; }
    getId(){ return this.id; }
    getName(){ return this.name; }
    getDisplayName(){ return this.name; }
    getSlug(){ return this.slug; }
    getLogin(){ return this.slug; }
    getImage(){ return this.image; }
    getProfile(){ return this.image; }
    getProfileImage(){ return this.image; }
    getFollowers(){ return this.followers; }
    getStamina(){ return this.stamina; }
    isFullStamina(){ return this.stamina >= this.maxStamina; }
    isEmptyStamina(){ return this.stamina <= 0; }
    isSleep(){ return this.sleep; }
    isPlace(){ return this.place; }
    isUnlocked(){ return this.isunlocked; }
    isNightBirds(){ return this.isnightbirds; }
    isChaosLovers(){ return this.ischaoslovers; }
    getType(){ return this.type; }
    getPartners(){ return this.partners; }
    getInfo(name){ return this.infos[name]; }
    setStamina(stam){ this.stamina = stam; }
    addStamina(){ this.stamina = (this.stamina >= this.maxStamina) ? this.maxStamina : this.stamina + 1; }
    reduceStamina(){ this.stamina = (this.stamina <= 0) ? 0 : this.stamina - 1; }
    resetStamina(){ this.stamina = this.maxStamina; }
    setMaxStamina(max){ this.maxStamina = max; }
    setSleep(issleep){ this.sleep = issleep; }
    setPlace(place){ this.place = place; }
    setUnlock(unlocked){ this.isunlocked = unlocked; }
    setType(type){ this.type = type; }
    setPartners(partners){ this.partners = partners; }
}
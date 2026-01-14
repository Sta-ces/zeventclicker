export default class Bonus{
    constructor(infoBonus){
        super(infoBonus);
        this.description = infoBonus.description;
        this.percentage = infoBonus.percentage;
        this.categorie = infoBonus.categorie;
    }

    get getDescription(){ return this.description; }
    get getPercentage(){ return this.percentage; }
    get getCategorie(){ return this.categorie; }
}
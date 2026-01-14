export default class Jackpot{
    constructor(initMoney = 0){
        this.initMoney = initMoney;
        this.money = initMoney;
    }
    getMoney(){ return this.money; }
    addMoney(sum){ this.money = Math.round(parseFloat(this.money + sum) * 100) / 100; }
    displayMoney(element, text = ""){ element.forEach(e => e.textContent = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(this.money) + text ); }
    resetMoney(){ this.money = this.initMoney; }
}
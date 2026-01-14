import { Chronometer, Timer } from '../assets/stEngine/inc/inc.js';
import Application from '../assets/stEngine/types/application.js';
import { options, stats, streamers, associations, tutorial, chaoslovers, nightbirds } from '../system/base.js';
import Streamer from '../classes/streamer.js';

new (class GameManager extends Application {
    constructor() {
        super({timerStamp: 1000, isUpdate: true})
        GameManager.GAMESTATE.LOADED = false;
        this.setState(GameManager.GAMESTATE.STOP)
        getElId("begin_stream").disabled = true
        getQueries(".gameversion").html(options.version.toFixed(1));

        // EVENTS
        this.getScreens().watchAttr("data-state", this.display.bind(this))
        this.getScreen("game").watchAttr("data-association-name", this.display.bind(this))
        this.getScreen("game").watchAttr("data-viewers", this.display.bind(this))
        this.getScreen("boost").watchAttr("data-state", this.onBoost.bind(this))

        getQueries(".difficulties-select").action("change", this.onDifficulty.bind(this))
        getQueries(".start-game").action("click", () => {
            if(getElId("association").value !== "") this.association = getElId("association").value
            stats.money.displayMoney(this.getMoneyContainers())
            this.getScreen("game").setAttribute("data-association-name", this.association)
            this.screen("game", true)
            this.screen("mainmenu", false)

            this.Pause()
        })
        getQueries(".button-live").action("click", this.clickStream.bind(this))
        getQueries(".reset").action("click", this.Reset.bind(this))

        action("mousemove", (e) => {
            getQueries("#app_bonus #bonuses_list li figcaption").forEach(figc => {
                let top = e.y - (figc.getBoundingClientRect().height * .5);
                figc.style.top = `${top}px`;
            });
        });

        this.onChrono()
    }

    getScreens(){ return getQueries(".screen-element"); }
    getScreen(name){ return getQuery(`.screen-element[name='${name}']`); }
    getMoneyContainers(){ return getQueries("title, .jackpot"); }

    async Awake(){
        super.Awake()

        this.streamers = [];
        this.isBoost = false;
        this.duration = options.timegame;
        this.chronometer = Chronometer.converter(this.duration)
        this.association = associations.random();

        let isInitStreamers = !sessionStorage.getItem("streamers") || false;

        console.warn("Streamers are loading");
        this.streamers = await ((isInitStreamers) ? this.getStreamsData() : JSON.parse(sessionStorage.getItem("streamers")));

        if(isInitStreamers){
            this.streamers = this.streamers.filter(str => str !== undefined)
            this.streamers.sort(function (a, b) { return a.followers - b.followers; });
        }
        if(isInitStreamers) sessionStorage.setItem("streamers", JSON.stringify(this.streamers))
    }

    async Start(){
        super.Start()

        await this.displayStreamers()
        console.log("Streamers loaded")
        GameManager.GAMESTATE.LOADED = true;
        getElId("begin_stream").disabled = false;
        //console.log(this.streamers)
    }

    Update(){
        super.Update()
        console.log(this.getState());

        if(!GameManager.GAMESTATE.LOADED){ this.Stop() }
    }

    Play(){
        super.Play()

        if(!GameManager.GAMESTATE.LOADED){
            this.Stop()
            return;
        }

        //let m = stats.viewers / this.streamers.length
        let m = (stats.viewers / this.streamers.length) * Math.max(this.streamers.filter(s => s.isUnlocked()).length / this.streamers.length, 0.01)
        stats.money.addMoney(m);
        stats.money.displayMoney(this.getMoneyContainers())
        //if(stats.money.getMoney() >= options.activeboost && (stats.money.getMoney()-(stats.money.getMoney()%options.activeboost))%options.activeboost === 0 && stats.money.getMoney() > 0) this.screen("boost", true)
        this.VFX(this, {
            containers: getQueries(".jackpot_container"),
            classname: "click_event vfx",
            textcontent: `+${m.toFixed(2)}€`
        })
        
        this.onChrono()
    }

    Pause(){
        super.Pause()
        
        if(getQuery("#checkbox_tutorial").checked) this.onTutorial()
        this.onChrono()
    }

    GameOver(){
        super.GameOver()

        this.PlaySound({
            src: `../assets/audios/finish.mp3`,
            volume: .75
        })

        this.screen("game", false)
        this.screen("finish", true)

        getQueries(".user-click").html(stats.user.click)
        getQueries(".user-streamers").html(stats.streamers)
        getQueries(".user-bonus").html(stats.user.bonus)
        getQueries(".user-viewers").html(stats.user.viewers)
    }

    Reset(){
        stats.user.click = 0
        stats.user.bonus = 0
        stats.user.achievement = 0
        stats.user.viewers = 0
        stats.percentages.click = 0
        stats.percentages.streamers = 0
        stats.percentages.speedstamina = 0
        stats.percentages.speedsleep = 0
        stats.viewers = 0
        stats.totalviewers = 0
        stats.streamers = 0
        stats.money.resetMoney()

        this.duration = options.timegame;
        this.onChrono()

        if(getQuery("#association_change").value !== "") this.association = getQuery("#association_change").value
        this.getScreen("game").setAttribute("data-association-name", this.association)

        this.getScreen("game").setAttribute("data-viewers", stats.viewers)
        stats.money.displayMoney(this.getMoneyContainers())

        this.streamers.map(str => {
            str.reset()
            let container = getQuery(`.streamer-container[data-id='${str.getId()}']`)
            container.setAttribute("data-display", false)
            container.classList.remove("streamer_sleep")
            container.getQuery(`.streamer_stamina`).style.setProperty("--stamina-percent", "100%")
        })

        this.screen("game", true)
        this.screen("tuto", false)
        this.screen("finish", false)
        this.Pause()
    }

    async getStreamsData() {
        return await Promise.all(
            Object.entries(streamers.onplace).map(async function([str,part]){
                try{
                    const streamer = await fetch(`./stream/${str}`);
                    const streamer_data = (await streamer.json()).data[0];
                    const streamer_followers = await fetch(`./followers/${streamer_data.id}`)
                    streamer_data.followers = (await streamer_followers.json()).total;
                    streamer_data.partners = part
                    streamer_data.nightbirds = nightbirds.includes(streamer_data.login)
                    streamer_data.chaoslovers = chaoslovers.includes(streamer_data.login)
                    return streamer_data;
                } catch(error){ console.error(error); }
            }
        ))
    }

    async displayStreamers(){
        if(this.streamers.length){
            // INIT STREAMERS HTML
            this.streamers = await this.streamers.map(str => {
                if(str !== undefined && str.status !== 404){
                    let streamer = new Streamer(str);
                    let partners = streamer.getPartners().length ? streamer.getPartners().map(p => new Streamer(this.streamers.find(s => s.login === p || s.slug === p))) : []
                    let partners_html = "";
                    if(partners.length || streamer.isNightBirds() || streamer.isChaosLovers()){
                        partners_html += `<div class="bonus-streamer-container">`;
                            if(partners.length){
                                partners_html += `<h3>Partenaires commerciaux</h3>`;
                                partners_html += `<p style="margin-left:5px;">x1.5 si ${partners.map(p =>  `<span class='color'>${p.getName()}</span>`).join(' ou ')} est en live.</p>`;
                            }
                            if(streamer.isNightBirds()){
                                partners_html += `<h3 style="margin:5px 0;">Oiseau de nuit</h3>`;
                                //partners_html += `<p>+5 viewers par autres streamers endormit</p>`;
                            }
                            if(streamer.isChaosLovers()){
                                partners_html += `<h3 style="margin:5px 0;">Partisan du chaos</h3>`;
                                //partners_html += `<p>+5 viewers par autres streamers en live</p>`;
                            }
                        partners_html += `</div>`;
                    }
                    let html = 
                        `<li data-id='${streamer.getId()}' data-display='${streamer.isUnlocked()}' class='animate__animated animate__faster streamer-container'>
                            <figure>
                                <img src='${streamer.getImage()}' class='photo_streamer'>
                                <figcaption>
                                    <h3 class='outline'>${streamer.getName()}</h3>
                                    <p class='streamer_unlock outline i-eye'>${new Intl.NumberFormat("fr-FR").format(streamer.getFollowers())}</p>
                                    <div class='streamer_stamina' style='--stamina-percent:${streamer.getStamina()}%;'></div>
                                    <img src='./images/cadenas.png' class='locked'>
                                    <p class='streamer_activity outline'></p>
                                </figcaption>
                            </figure>
                            ${partners_html}
                        </li>`;
                    let template = this.create({
                        element: "template",
                        textContent: html,
                        append: false
                    })
                    let node = template.content.childNodes[0]
                    node.watchAttr("data-display", (m, a) => this.onStreamer(streamer, m))
                    node.action("click", (e) => {
                        let target = e.target.closest(".streamer-container") || e.target
                        if(stats.viewers >= streamer.getFollowers()){
                            this.PlaySound({
                                src: `../assets/audios/appears.mp3`
                            })
                            target.setAttribute("data-display", true)
                            streamer.setUnlock(true)
                        }
                    })
                    getQuery("#streamers_list").appendChild(node)
                    return streamer
                }
            });
        }
        else{
            console.error("Streamers not found")
            getQuery("#begin_stream").html("Une erreur s'est produite")
        }
    }

    clickStream(){
        stats.user.click++;
        this.PlaySound({
            src: `../assets/audios/mouse${random(1,2)}.mp3`,
            volume: .5
        })
        this.VFX(this, {
            containers: getQueries(".button-live"),
            classname: "wave_click_event vfx",
            animation: "animate__bounceOut"
        })
        this.onViewer();

        if(!this.isPlay()) this.Play()
    }

    onChrono(){
        if(this.isPlay()){
            this.PlaySound({
                src: `../assets/audios/tic-tac.mp3`,
                volume: .1
            })
            this.duration -= 60
        }

        this.chronometer = Chronometer.converter(this.duration)
        getQueries(".timer_game").html(`${this.chronometer.minutes}:${this.chronometer.seconds}`)
        if(this.duration <= 0) this.GameOver()
    }

    onViewer(additionnal = 0){
        let num = random(options.clickevent[0], options.clickevent[1]) + stats.percentages.click.percentage({execute: "value"}) + additionnal;
        stats.user.viewers = num;
        stats.totalviewers += num;
        stats.viewers += num;
        this.getScreen("game").setAttribute("data-viewers", stats.viewers);
    }

    onStreamer(streamer, node){
        if(this.isPlay() && streamer.isUnlocked()){
            stats.streamers++;
            node.target.classList.add("animate__tada");
            stats.viewers -= streamer.getFollowers();
            streamer.resetStamina();
            this.getScreen("game").setAttribute("data-viewers", stats.viewers);

            setTimeout(() => { node.target.classList.remove("animate__tada"); }, 2000)
            
            let timerStamina = new Timer((() => {
                if(this.isPlay()){
                    if(!streamer.isSleep()){
                        streamer.reduceStamina();

                        let isAdd = this.streamers.filter(s => {
                            return streamer.getPartners().includes(s.getSlug()) && (s.isUnlocked() && !s.isSleep())
                        }).length > 0
                        let additionnal = isAdd ? random(options.clickevent[0] * 0.5, options.clickevent[1] * 0.5) : 0
                        additionnal += streamer.isNightBirds() ? this.streamers.filter(s => s.isUnlocked() && s.getId() !== streamer.getId() && s.isSleep()).length * 5 : 0
                        additionnal += streamer.isChaosLovers() ? this.streamers.filter(s => s.isUnlocked() && s.getId() !== streamer.getId() && !s.isSleep()).length * 5 : 0

                        if(this.isBoost){
                            node.target.classList.add("animate__infinite", "animate__shakeY")
                            additionnal *= 1.5
                        } else node.target.classList.remove("animate__infinite", "animate__shakeY")

                        this.onViewer(additionnal);
                        this.VFX(this, {
                            containers: [node.target],
                            classname: "streamer_click_event vfx",
                            animation: "animate__bounceOut"
                        })

                        if(streamer.isEmptyStamina()){
                            streamer.setSleep(true);
                            node.target.classList.add("streamer_sleep")
                            timerStamina.reset(options.speedsleep.percentage({
                                execute: "reduce",
                                reduce: stats.percentages.speedsleep
                            }));
                        }
                    }
                    else{
                        streamer.addStamina();
                        if(streamer.isFullStamina()){
                            streamer.setSleep(false);
                            node.target.classList.remove("streamer_sleep")
                            timerStamina.reset(options.speedstamina + stats.percentages.speedstamina.percentage({ execute: "value" }));
                        }
                    }
                    node.target.getQuery(".streamer_stamina").setAttribute("style", "--stamina-percent:"+streamer.getStamina()+"%;");
                }
                else timerStamina.stop()
            }).bind(this), options.speedstamina + stats.percentages.speedstamina.percentage({ execute: "value" }));
        }
    }

    onBoost(m, attribute){
        if(!this.isBoost && m.target.getAttribute("data-state") === "open"){
            this.isBoost = true;
            /*getQueries(".streamer-container").classList.add("animate__infinite")
            getQueries(".streamer-container").classList.add("animate__shakeY")*/
            setTimeout(() => {
                this.isBoost = false;
                this.screen("boost", false)
            }, options.timeboost)
        }
    }

    onBonuses(bonus, node){
        if(this.isPlay() && node.target.getAttribute("data-display") == "true"){
            stats.user.bonus++
            /**
            switch(el.getCategorie){
                case "streamer": percentStreamer(el.getPercentage); break;
                case "clique": percentClick(el.getPercentage); break;
                case "stamina": percentStamina(el.getPercentage); break;
                case "sleep": percentSleep(el.getPercentage); break;
            }
            */
        }
    }

    onAchievement(achievement, node){
        if(this.isPlay() && node.target.getAttribute("data-display") == "true"){
            stats.user.achievement++
        }
    }

    onTutorial(){
        let active_page_tuto = 1;
        let all_page_tuto = tutorial.length;
        let association = this.association;

        this.screen("tutorial", true)
        getQuery("#checkbox_tutorial").checked = false
        this.getScreen("tutorial").classList.remove("none");
        this.getScreen("tutorial").classList.add("animate__animated");
        this.getScreen("tutorial").classList.add("animate__bounceInRight");
        getQuery("body").classList.add("tuto");
        if(active_page_tuto <= 1) getQuery("#app_tuto .previous").classList.add("none");
        getQuery("#app_tuto #page_number .active").textContent = active_page_tuto;
        getQuery("#app_tuto #page_number .all").textContent = all_page_tuto;
    
        tutoNavigation();
        getQuery("#app_tuto .next").action("click", tutoNext);
        getQuery("#app_tuto .previous").action("click", tutoPrev);
        getQuery("#app_tuto .close").action("click", tutoClose.bind(this));

        function tutoNavigation(){
            getQuery("#app_tuto #page_number .active").html(active_page_tuto);
        
            if(active_page_tuto <= 1) getQueries("#app_tuto .previous").classList.add("none");
            else getQueries("#app_tuto .previous").classList.remove("none");
        
            if(active_page_tuto >= all_page_tuto) getQueries("#app_tuto .next").classList.add("none");
            else getQueries("#app_tuto .next").classList.remove("none");
        
            let active_tuto = tutorial[active_page_tuto-1];
            active_tuto.explication = active_tuto.explication.replaceAll("{assos_name}", association);
            active_tuto.explication = active_tuto.explication.replaceAll("{money}", stats.money.getMoney());
            active_tuto.explication = active_tuto.explication.replaceAll("{color}", "<span class='color'>");
            active_tuto.explication = active_tuto.explication.replaceAll("{/color}", "</span>");

            getQuery("#app_tuto .tuto_title").html(active_tuto.title);
            getQuery("#app_tuto .tuto_subtitle").html(active_tuto.subtitle);
            getQuery("#app_tuto .tuto_explication").html(active_tuto.explication);
        }

        function tutoNext(){
            active_page_tuto++;
            tutoNavigation();
        }
        
        function tutoPrev(){
            active_page_tuto--;
            tutoNavigation();
        }

        function tutoClose(){
            this.getScreen("tutorial").classList.replace("animate__bounceInRight", "animate__bounceOutRight");
            setTimeout((() => {
                getQuery("body").classList.remove("tuto");
                this.getScreen("tutorial").classList.add("none");
            }).bind(this), 750);
        }
    }

    onDifficulty(e){
        let select = e.target;
        switch(select.value){
            case "easy":
                options.timegame = 54000
                options.speedsleep = 800
                options.speedstamina = 800
                break;
            case "normal":
                options.timegame = 45000
                options.speedsleep = 800
                options.speedstamina = 600
                break;
            case "hard":
                options.timegame = 36000
                options.speedsleep = 800
                options.speedstamina = 400
                break;
        }

        this.duration = options.timegame;
        this.onChrono()
    }

    display(watch, attribute){
        switch(attribute){
            case "data-association-name":
                getQueries(".association-name").html(this.association);
                break;
            case "data-viewers":
                this.VFX(this, {
                    containers: getQueries(".viewers_container"),
                    textcontent: `+${stats.user.viewers}`,
                    classname: "click_event vfx",
                    style: `--right: ${random(0,100)}px`
                })
                getQueries(".viewers").html(new Intl.NumberFormat("fr-FR").format(stats.viewers));
                getQueries(".total-viewers").html(new Intl.NumberFormat("fr-FR").format(stats.totalviewers));
                break;
        }
    }

    VFX(manager, {containers, textcontent = '', tag = 'span', classname, animation = 'animate__fadeOutUp', style = ""}){
        containers.forEach(c => {
            let el = manager.create({
                element: tag,
                classname: `${classname} animate__animated ${animation}`,
                textContent: textcontent,
                parent: c
            })
            el.style = style;

            setTimeout(() => {
                el.remove();
            }, 1000);
        })
    }
})()

if(!HTMLElement.prototype.hasOwnProperty("setTimeOut")){
    HTMLElement.prototype.setTimeOut = function(callback, timestamp = 1000){
        if(timestamp <= 0) return callback
        setTimeout(callback.bind(this), timestamp)
    }
}
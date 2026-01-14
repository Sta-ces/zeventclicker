import Jackpot from '../classes/jackpot.js'

export const options = {
    version: 4.0,
    timeinsecond: 500,
    timegame: 45000, // 12 minutes 30 secondes (45000)
    timeboost: 15000,
    activeboost: 100000, // every 100.000
    clickevent: [90, 140], // min and max view gain per click
    speedstamina: 600,
    speedsleep: 800
}

export let stats = {
    user: {
        click: 0,
        bonus: 0,
        achievements: 0,
        viewers: 0
    },
    percentages: { // add viewers percentages
        click: 0,
        streamers: 0,
        speedstamina: 0,
        speedsleep: 0
    },
    viewers: 0,
    totalviewers: 0,
    streamers: 0,
    money : new Jackpot()
}

export const streamers = {
    "distance": [],
    "onplace": {
        "alphacast": ["mistermv", "avamind"],
        "angledroit": [],
        "antoinedaniel": ["joueur_du_grenier", "bagherajones"],
        "avamind": ["alphacast"],
        "bagherajones": ["antoinedaniel", "hortyunderscore"],
        "clemovitch": [],
        "damdamlive": [],
        "doigby": [],
        "domingo": [],
        "drfeelgood": [],
        "etoiles": ["zerator"],
        "gius": ["moman"],
        "gom4rt": ["littlebigwhale"],
        "helydia": [],
        "hortyunderscore": ["bagherajones"],
        "jltomy": ["sakor_", "kamet0"],
        "joueur_du_grenier": ["antoinedaniel"],
        "kamet0": ["sakor_", "jltomy"],
        "kennystream": ["zerator"],
        "laink": [],
        "lapi": [],
        "littlebigwhale": ["gom4rt"],
        "mistermv": ["alphacast", "mynthos"],
        "moman": ["gius"],
        "mynthos": ["mistermv", "shisheyu"],
        "opcrotte": [],
        "ponce": ["ultia", "rivenzi"],
        "pressea": [],
        "rivenzi": ["ponce", "ultia"],
        "sakor_": ["kamet0", "jltomy"],
        "samueletienne": [],
        "shisheyu": ["mynthos"],
        "sundae": [],
        "tonton": [],
        "ultia": ["ponce", "rivenzi"],
        "zerator": ["kennystream", "gius", "moman"]
    }
}

export const nightbirds = ["antoinedaniel", "doigby", "etoiles", "gom4rt", "kamet0", "kennystream", "laink", "mistermv", "moman", "zerator"]

export const chaoslovers = ["bagherajones", "doigby", "domingo", "gom4rt", "mistermv", "moman", "opcrotte", "tonton", "zerator"]

export const associations = [ "Une pièce pour le développeur", "Save the Children", "Croix-Rouge", "Médecins sans frontières", "Institut Pasteur", "Amnesty International", "Libération de Balkany", "L'art du culturisme", "Action contre la faim", "Sea Shepherd", "LPO", "WWF", "Time For The Planet", "The SeaCleaners", "Secours Populaire", "Cop1", "Les Bureaux du Coeur", "Solidarité Paysans", "Chapitre 2" ]

export const activites = [
    {
        "name": "Tournoi Mario Kart",
        "streamers": ["moman", "antoinedaniel", "etoiles"],
        "actif": true
    },
    {
        "name": "Combat de sumo",
        "streamers": [],
        "actif": false
    },
    {
        "name": "Combat de boxe",
        "streamers": ["alphacast", "gius", "rivenzi"],
        "actif": false
    },
    {
        "name": "Tournoi Fall Guys",
        "streamers": ["zerator", "moman", "mistermv", "antoinedaniel", "kennystream", "mynthos"],
        "actif": true
    },
    {
        "name": "Karaoke",
        "streamers": ["littlebigwhale", "zerator", "moman", "mistermv", "drfeelgood", "bagherajones"],
        "actif": true
    },
    {
        "name": "Pixels War",
        "streamers": [],
        "actif": false
    }
]

export const bonuses = [
    {
        "id": 0,
        "slug": "megaphonezrt",
        "name": "Mégaphone ZRT",
        "unlock": 20000,
        "description": "60% supplémentaire par streamers",
        "percentage": 60,
        "categorie": "streamer"
    },
    {
        "id": 1,
        "slug": "sourisdoree",
        "name": "Souris dorée",
        "unlock": 10500,
        "description": "50% supplémentaire par clique",
        "percentage": 50,
        "categorie": "clique"
    },
    {
        "id": 2,
        "slug": "sourisacier",
        "name": "Souris en acier",
        "unlock": 4000,
        "description": "30% supplémentaire par clique",
        "percentage": 30,
        "categorie": "clique"
    },
    {
        "id": 3,
        "slug": "sourisrenforcee",
        "name": "Souris renforcée",
        "unlock": 1000,
        "description": "20% supplémentaire par clique",
        "percentage": 20,
        "categorie": "clique"
    },
    {
        "id": 4,
        "slug": "compagnondejeu",
        "name": "Compagnon de jeu",
        "unlock": 6800,
        "description": "15% supplémentaire par streamers",
        "percentage": 15,
        "categorie": "streamer"
    },
    {
        "id": 5,
        "slug": "fluteslocklear",
        "name": "Les flûtes de Locklear",
        "unlock": 3500,
        "description": "Réduit de 20% le temps de sommeil des streamers",
        "percentage": 20,
        "categorie": "sleep"
    },
    {
        "id": 6,
        "slug": "nuitblanche",
        "name": "Nuit blanche",
        "unlock": 8500,
        "description": "Réduit de 40% le temps de sommeil des streamers",
        "percentage": 40,
        "categorie": "sleep"
    },
    {
        "id": 7,
        "slug": "cafeine",
        "name": "Caféine",
        "unlock": 6000,
        "description": "Double le temps de live des streamers",
        "percentage": 100,
        "categorie": "stamina"
    },
    {
        "id": 8,
        "slug": "insomniaque",
        "name": "Insomniaque",
        "unlock": 15000,
        "description": "Triple le temps de live des streamers",
        "percentage": 200,
        "categorie": "stamina"
    },
    {
        "id": 9,
        "slug": "chinanumberone",
        "name": "China number one!",
        "unlock": 10000,
        "description": "40% supplémentaire par streamers",
        "percentage": 40,
        "categorie": "streamer"
    }
]

export const achievements = [
    {
        "id": 0,
        "name": "Zerator en force !",
        "description": "Débloquer Zerator",
        "unlock": {
            "streamers": ["zerator"]
        }
    },
    {
        "id": 1,
        "name": "La SQUAD au complet !",
        "description": "Débloquer tous les streamers",
        "unlock": {
            "streamers": streamers.onplace
        }
    },
    {
        "id": 2,
        "name": "Full boost !",
        "description": "Débloquer tous les bonus",
        "unlock": {
            "bonus": bonuses
        }
    },
    {
        "id": 3,
        "name": "MoManus number one !",
        "description": "Débloquer le bonus et streamer MoMan",
        "unlock": {
            "streamers": ["moman"],
            "bonus": ["chinanumberone"]
        }
    },
    {
        "id": 4,
        "name": "Hard clicker !",
        "description": "Débloquer tous les bonus de souris",
        "unlock": {
            "bonus": ["sourisdoree", "sourisacier", "sourisrenforcee"]
        }
    },
    {
        "id": 5,
        "name": "Marwhale is back !",
        "description": "Débloquer Gom4rt et Little Big Whale",
        "unlock": {
            "streamers": ["littlebigwhale", "gom4rt"]
        }
    }
]

export const tutorial = [
    {
        "title": "Salut c'est Dach !",
        "subtitle": "Bonjour à tous les amis !",
        "explication": "Je suis ici pour t'aider à mieux comprendre ce jeu d'une grande complexité."
    },
    {
        "title": "Informations utiles",
        "subtitle": "quelques disclaimers chiantes",
        "explication": "Je rappelle que ceci n'est pas un jeu officiel de l'événement caritatif \"{color}zevent{/color}\", mais une réalisation exceptionnelle créée en 3 jours et améliorée chaque année dans une chambre d'un développeur n'aimant pas beaucoup la lumière du jour."
    },
    {
        "title": "Informations utiles",
        "subtitle": "quelques disclaimers chiantes",
        "explication": "Je demande donc aux joueurs de ne pas prendre ce jeu au sérieux (argent fictif, je le rappel) et les streamers y figurant de ne pas envoyer leurs avocats à ce pauvre développeur indépendant. Je vous en prie."
    },
    {
        "title": "Ton but",
        "subtitle": "si tu le veux bien...",
        "explication": "Tu dois récolter de l'argent (fictif) pour l'association \"{color}{assos_name}{/color}\" dans un temps impartis. C'est simple, non?"
    },
    {
        "title": "Lancer un live",
        "subtitle": "Appuis sur le gros bouton",
        "explication": "Pour attirer des spectateurs, il faut {color}LIVE!{/color}. Appuie frénétiquement sur le bouton {color}LIVE!{/color} pour attirer le plus de monde possible."
    },
    {
        "title": "Les spectateurs",
        "subtitle": "ou viewers si tu es un mec cool",
        "explication": "Le nombre de spectateurs est très important, car c'est la seule donnée sur laquelle tu as une influence, plus tu as de spectateurs, plus les dons seront volumineux."
    },
    {
        "title": "Les spectateurs",
        "subtitle": "ou viewers si tu es un mec cool",
        "explication": "Vous aurez aussi la possibilité de faire une {color}SQUAD{/color}, c'est-à-dire de réaliser un stream avec un.e streame.r.use. Cela vous coûtera des spectateurs, mais vous les récupérerez très rapidement grâce à vos talents réunis."
    },
    {
        "title": "Les streamers",
        "subtitle": "(/influenceurs, /talents)",
        "explication": "Chaque streamer te rapportera davantage de spectateurs automatiquement sans même que tu es le besoin de {color}LIVE!{/color}. Cependant, n'oublie pas qu'ils sont avant toutes choses des êtres humains et ils auront besoin de se reposer à un moment donné. Laisses-leurs du temps !"
    },
    {
        "title": "Les streamers",
        "subtitle": "(/influenceurs, /talents)",
        "explication": "Chaque streamer a sa propre personnalité et peut apporter plus de viewers en fonction de son environnement. Les {color}oiseaux de nuit{/color} donne +5 viewers par streamer endormit, contrairement aux {color}partisans du chaos{/color} qui donne +5 viewers par streamer en live."
    },
    {
        "title": "Le temps",
        "subtitle": "Et c'est le temps qui court !",
        "explication": "N'oublie pas que ton {color}temps est limité{/color}, tu dois absolument garder un œil sur cette horloge qui définis la fin de ta levée de fonds."
    },
    {
        "title": "Jouer",
        "subtitle": "",
        "explication": "Tu as beaucoup de travail aujourd'hui et moi aussi. Appuie sur le bouton Terminer pour clôturer ce tutoriel et démarrer la levée de fonds."
    }
]
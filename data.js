const GAME_DATA={
  "CHAR": {
    "metal_sonic": {
      "name": "Metal Sonic",
      "sprite": "metal_sonic",
      "hp": 560,
      "speed": 330,
      "jump": 720,
      "ai": "hyper",
      "abilities": [
        [
          "1",
          "Metal Jab",
          "melee",
          30,
          0.28
        ],
        [
          "2",
          "Arm Beam",
          "projectile",
          26,
          0.72
        ],
        [
          "3",
          "Chaos Blast",
          "blast",
          62,
          4
        ],
        [
          "4",
          "Chaos Spear",
          "cinematic",
          86,
          12
        ]
      ],
      "theme": [
        "#69d2ff",
        "beam"
      ],
      "ultimate": [
        "Chaos Spear",
        "cinematic",
        180
      ]
    },
    "neo_metal": {
      "name": "Neo Metal Sonic",
      "sprite": "neo_metal",
      "hp": 760,
      "speed": 340,
      "jump": 730,
      "ai": "hyper",
      "abilities": [
        [
          "1",
          "Neo Rush",
          "melee",
          34,
          0.23
        ],
        [
          "2",
          "Chaos Spear",
          "projectile",
          35,
          0.62
        ],
        [
          "3",
          "Chaos Blast",
          "blast",
          78,
          3.4
        ],
        [
          "4",
          "Overlord Dive",
          "cinematic",
          110,
          12
        ]
      ],
      "theme": [
        "#469aff",
        "spear"
      ],
      "ultimate": [
        "Overlord Dive",
        "cinematic",
        180
      ]
    },
    "super_neo_metal": {
      "name": "Super Neo Metal Sonic",
      "sprite": "super_neo_metal",
      "hp": 920,
      "speed": 355,
      "jump": 760,
      "ai": "hyper",
      "abilities": [
        [
          "1",
          "Super Rush",
          "melee",
          38,
          0.2
        ],
        [
          "2",
          "Chaos Spear MAX",
          "projectile",
          42,
          0.55
        ],
        [
          "3",
          "Chaos Blast",
          "blast",
          90,
          3
        ],
        [
          "4",
          "Super Giga Beam",
          "cinematic",
          130,
          12
        ]
      ],
      "theme": [
        "#ffcd58",
        "spear"
      ],
      "ultimate": [
        "Super Giga Beam",
        "cinematic",
        208
      ]
    },
    "ada": {
      "name": "Ada",
      "sprite": "ada",
      "hp": 510,
      "speed": 255,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Dora Dora Dora",
          "melee",
          30,
          0.24
        ],
        [
          "2",
          "Crazy Diamond",
          "toggle",
          0,
          1
        ],
        [
          "3",
          "Cherry Blast",
          "projectile",
          55,
          2.6
        ],
        [
          "4",
          "White Slow",
          "cinematic",
          96,
          12
        ]
      ],
      "standAbilities": [
        [
          "1",
          "Crazy Diamond Barrage",
          "melee",
          38,
          0.24
        ],
        [
          "2",
          "Restoration Dash",
          "rush",
          48,
          0.8
        ],
        [
          "3",
          "Restoration Shot",
          "projectile",
          50,
          2.2
        ],
        [
          "4",
          "Dismiss Crazy Diamond",
          "toggle",
          0,
          0.5
        ]
      ],
      "forms": [
        "ada",
        "ada_evo1",
        "ada_evo2",
        "ada_evo3"
      ],
      "standName": "Crazy Diamond",
      "standSprite": "crazy_diamond",
      "theme": [
        "#fb5a9b",
        "cherry"
      ],
      "ultimate": [
        "Big Cherry Blast",
        "cinematic",
        260
      ]
    },
    "raph": {
      "name": "Raph",
      "sprite": "raph",
      "hp": 525,
      "speed": 248,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Oraoraora",
          "melee",
          31,
          0.23
        ],
        [
          "2",
          "Star Platinum",
          "rush",
          42,
          0.82
        ],
        [
          "3",
          "Hat Throw",
          "projectile",
          42,
          2.1
        ],
        [
          "4",
          "Domain Tenkai",
          "cinematic",
          96,
          12
        ]
      ],
      "forms": [
        "raph",
        "raph_evo1",
        "raph_evo2"
      ],
      "theme": [
        "#bb91ff",
        "fist"
      ],
      "ultimate": [
        "Domain Tenkai",
        "cinematic",
        180
      ]
    },
    "leonard": {
      "name": "Leonard",
      "sprite": "leonard",
      "hp": 590,
      "speed": 220,
      "jump": 610,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Acid Spit",
          "poison_melee",
          32,
          0.65
        ],
        [
          "2",
          "Incognito Mode",
          "invisible",
          0,
          9
        ],
        [
          "3",
          "Acid Goun",
          "poison_projectile",
          43,
          2.7
        ],
        [
          "4",
          "Iron Man Polyester Edit",
          "summon",
          150,
          16
        ]
      ],
      "theme": [
        "#8afa52",
        "acid"
      ],
      "ultimate": [
        "Iron Man Polyester Edit",
        "summon",
        260
      ]
    },
    "max": {
      "name": "Max",
      "sprite": "max_chain",
      "hp": 520,
      "speed": 275,
      "jump": 700,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Max Attack",
          "melee",
          40,
          0.42
        ],
        [
          "2",
          "Full Lead Charge",
          "rush",
          66,
          2
        ],
        [
          "3",
          "Lead Bullet",
          "projectile",
          54,
          2.4
        ],
        [
          "4",
          "Max Dance",
          "cinematic",
          130,
          12
        ]
      ],
      "forms": [
        "max_chain",
        "max_evo"
      ],
      "theme": [
        "#eac55c",
        "bullet"
      ],
      "ultimate": [
        "Max Dance",
        "cinematic",
        208
      ]
    },
    "shane": {
      "name": "Shane",
      "sprite": "shane",
      "hp": 470,
      "speed": 285,
      "jump": 730,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Knife Stab",
          "melee",
          36,
          0.38
        ],
        [
          "2",
          "Ghost Phase",
          "phase",
          45,
          3
        ],
        [
          "3",
          "Knife Throw",
          "projectile",
          46,
          2
        ],
        [
          "4",
          "Flower Type 3 Gambling",
          "buff",
          104,
          104
        ]
      ],
      "theme": [
        "#78f8ef",
        "knife"
      ],
      "ultimate": [
        "Flower Type 3 Gambling",
        "buff",
        104
      ]
    },
    "seth": {
      "name": "Seth",
      "sprite": "seth",
      "hp": 500,
      "speed": 245,
      "jump": 665,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Book",
          "melee",
          30,
          0.28
        ],
        [
          "2",
          "Shield",
          "selfprotect",
          200,
          10
        ],
        [
          "3",
          "Kind Words",
          "projectile",
          36,
          2.8
        ],
        [
          "4",
          "No Playing Shane",
          "cinematic",
          88,
          12
        ]
      ],
      "theme": [
        "#b38cff",
        "book"
      ],
      "ultimate": [
        "No Playing Shane",
        "cinematic",
        180
      ]
    },
    "flowery": {
      "name": "Jerona Man",
      "sprite": "flowery",
      "hp": 560,
      "speed": 238,
      "jump": 630,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Leaf Punch",
          "melee",
          36,
          0.32
        ],
        [
          "2",
          "Leaf It To Me",
          "rush",
          46,
          1
        ],
        [
          "3",
          "Flower Dreams",
          "blast",
          55,
          2.8
        ],
        [
          "4",
          "Jarona!",
          "cinematic",
          95,
          12
        ]
      ],
      "theme": [
        "#d8ef6b",
        "leaf"
      ],
      "ultimate": [
        "Jarona!",
        "cinematic",
        180
      ]
    },
    "oliver": {
      "name": "Oliver",
      "sprite": "oliver",
      "hp": 500,
      "speed": 255,
      "jump": 670,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Olive Whip",
          "melee",
          30,
          0.28
        ],
        [
          "2",
          "Sciences Evolution",
          "rush",
          48,
          0.9
        ],
        [
          "3",
          "Stem Equations",
          "projectile",
          40,
          2.2
        ],
        [
          "4",
          "Olive Garden",
          "cinematic",
          95,
          12
        ]
      ],
      "theme": [
        "#9feaac",
        "leaf"
      ],
      "ultimate": [
        "Olive Garden",
        "cinematic",
        180
      ]
    },
    "nande": {
      "name": "Nande",
      "sprite": "nande",
      "hp": 590,
      "speed": 225,
      "jump": 610,
      "ai": "support",
      "abilities": [
        [
          "1",
          "Healing Music",
          "heal",
          135,
          6
        ],
        [
          "2",
          "GO TO SPACE!",
          "banish",
          0,
          8
        ],
        [
          "3",
          "Mic Blast",
          "projectile",
          50,
          2.5
        ],
        [
          "4",
          "Jak Does Snacks",
          "cinematic",
          135,
          14
        ]
      ],
      "theme": [
        "#d7a8ff",
        "music"
      ],
      "ultimate": [
        "Jak Does Snacks",
        "cinematic",
        290
      ]
    },
    "vivi": {
      "name": "Vivi",
      "sprite": "vivi",
      "hp": 505,
      "speed": 260,
      "jump": 690,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Choso’s Ashes",
          "melee",
          29,
          0.26
        ],
        [
          "2",
          "Ratafak Fury",
          "rush",
          44,
          1
        ],
        [
          "3",
          "Heart Beam",
          "projectile",
          42,
          2
        ],
        [
          "4",
          "Fuga",
          "cinematic",
          100,
          12
        ]
      ],
      "theme": [
        "#ff93c4",
        "heart"
      ],
      "ultimate": [
        "Fuga",
        "cinematic",
        180
      ]
    },
    "raleigh": {
      "name": "Raleigh",
      "sprite": "raleigh",
      "hp": 485,
      "speed": 290,
      "jump": 700,
      "ai": "hyper",
      "abilities": [
        [
          "1",
          "Peck Attack",
          "melee",
          31,
          0.25
        ],
        [
          "2",
          "Thanksgiving",
          "rush",
          46,
          0.8
        ],
        [
          "3",
          "Wing Toss",
          "projectile",
          38,
          2.1
        ],
        [
          "4",
          "White Owl",
          "toggle",
          0,
          1
        ]
      ],
      "standAbilities": [
        [
          "1",
          "Weight Change",
          "lift",
          42,
          4
        ],
        [
          "2",
          "Barrier",
          "protector",
          200,
          10
        ],
        [
          "3",
          "100,000,000 Pounds",
          "stun",
          10,
          10
        ],
        [
          "4",
          "Dismiss White Owl",
          "toggle",
          0,
          0.5
        ]
      ],
      "standName": "White Owl",
      "standSprite": "white_owl",
      "rombieAbilities": [
        [
          "1",
          "Buffed White Owl Lift",
          "lift",
          85,
          3
        ],
        [
          "2",
          "Rombie Peck",
          "rush",
          72,
          1.8
        ],
        [
          "3",
          "Cuellar’s Will",
          "protector",
          260,
          9
        ],
        [
          "4",
          "Return to Raleigh",
          "rombie_toggle",
          0,
          0.5
        ]
      ],
      "theme": [
        "#dace95",
        "feather"
      ],
      "ultimate": [
        "100,000,000 Pounds",
        "cinematic",
        250
      ]
    },
    "myles": {
      "name": "Myles",
      "sprite": "myles",
      "hp": 480,
      "speed": 270,
      "jump": 690,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Cupcake Jab",
          "melee",
          24,
          0.26
        ],
        [
          "2",
          "Blue Line Attack",
          "projectile",
          44,
          0.85
        ],
        [
          "3",
          "Bakery Bakery",
          "blast",
          54,
          2.4
        ],
        [
          "4",
          "Louisiana Purchase",
          "cinematic",
          100,
          12
        ]
      ],
      "theme": [
        "#70caff",
        "cupcake"
      ],
      "ultimate": [
        "Louisiana Purchase",
        "cinematic",
        180
      ]
    },
    "vaughn": {
      "name": "Vaughn",
      "sprite": "vaughn",
      "hp": 500,
      "speed": 272,
      "jump": 690,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Web Strike",
          "melee",
          29,
          0.26
        ],
        [
          "2",
          "Hulk Polyester",
          "rush",
          58,
          3
        ],
        [
          "3",
          "Acid Maple Syrup",
          "poison_projectile",
          52,
          3.2
        ],
        [
          "4",
          "Burning Finale",
          "cinematic",
          100,
          12
        ]
      ],
      "theme": [
        "#ff6b61",
        "web"
      ],
      "ultimate": [
        "Burning Finale",
        "cinematic",
        180
      ]
    },
    "mighty_eagle": {
      "name": "Mighty Eagle",
      "sprite": "mighty_eagle",
      "hp": 1800,
      "speed": 275,
      "jump": 780,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Titan Wing Strike",
          "melee",
          92,
          0.65
        ],
        [
          "2",
          "Wing Guard",
          "selfprotect",
          320,
          8
        ],
        [
          "3",
          "HAYYY YOOO Dive",
          "rush",
          145,
          3
        ],
        [
          "4",
          "Atom Scatter",
          "oneshot",
          99999,
          20
        ]
      ],
      "theme": [
        "#ffe6aa",
        "feather"
      ],
      "ultimate": [
        "Giga Eagle Crash",
        "cinematic",
        400
      ]
    },
    "overtime_user": {
      "name": "Overtime User",
      "sprite": "overtime_user",
      "hp": 560,
      "speed": 250,
      "jump": 670,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Overtime Strike",
          "melee",
          30,
          0.27
        ],
        [
          "2",
          "Pigeon Viola",
          "projectile",
          46,
          0.9
        ],
        [
          "3",
          "Old Shadow Technique",
          "blast",
          62,
          3
        ],
        [
          "4",
          "DOMAIN TENKAI: OVERTIME",
          "cinematic",
          112,
          12
        ]
      ],
      "theme": [
        "#b5d6f5",
        "wave"
      ],
      "ultimate": [
        "DOMAIN TENKAI: OVERTIME",
        "cinematic",
        180
      ]
    },
    "michael": {
      "name": "Michael",
      "sprite": "michael",
      "hp": 580,
      "speed": 255,
      "jump": 650,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Overtime Strike",
          "melee",
          31,
          0.28
        ],
        [
          "2",
          "DRILL",
          "rush",
          48,
          1
        ],
        [
          "3",
          "PIGEON VIOLA",
          "projectile",
          54,
          2.2
        ],
        [
          "4",
          "DOMAIN TENKAI: OVERTIME",
          "cinematic",
          112,
          12
        ]
      ],
      "scale": 1.22,
      "theme": [
        "#f9a759",
        "fist"
      ],
      "ultimate": [
        "DOMAIN TENKAI: OVERTIME",
        "cinematic",
        180
      ]
    },
    "choso": {
      "name": "Choso",
      "sprite": "choso",
      "hp": 500,
      "speed": 252,
      "jump": 665,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Blood Jab",
          "melee",
          27,
          0.27
        ],
        [
          "2",
          "Piercing Blood",
          "projectile",
          49,
          0.85
        ],
        [
          "3",
          "Blood Wave",
          "blast",
          57,
          2.6
        ],
        [
          "4",
          "Piercing Blood MAX",
          "cinematic",
          96,
          12
        ]
      ],
      "theme": [
        "#e65c82",
        "blood"
      ],
      "ultimate": [
        "Piercing Blood MAX",
        "cinematic",
        180
      ]
    },
    "todo": {
      "name": "Todo",
      "sprite": "todo",
      "hp": 600,
      "speed": 250,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Vessel Jab",
          "melee",
          35,
          0.28
        ],
        [
          "2",
          "Boogie Woogie",
          "swap",
          0,
          0.9
        ],
        [
          "3",
          "Rock Throw",
          "projectile",
          42,
          2.5
        ],
        [
          "4",
          "BESTO FRIENDO",
          "cinematic",
          100,
          12
        ]
      ],
      "theme": [
        "#f4ba79",
        "fist"
      ],
      "ultimate": [
        "BESTO FRIENDO",
        "cinematic",
        180
      ]
    },
    "king_doodle": {
      "name": "Doodle Bob",
      "sprite": "king_doodle",
      "hp": 680,
      "speed": 210,
      "jump": 590,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Pencil Smack",
          "melee",
          36,
          0.31
        ],
        [
          "2",
          "Doodle Army",
          "rush",
          50,
          0.9
        ],
        [
          "3",
          "Pencil Beam",
          "projectile",
          54,
          2.1
        ],
        [
          "4",
          "Just This Once, Let’s LARP",
          "cinematic",
          110,
          12
        ]
      ],
      "theme": [
        "#eeeeee",
        "pencil"
      ],
      "ultimate": [
        "Just This Once, Let’s LARP",
        "cinematic",
        180
      ]
    },
    "rapper_po": {
      "name": "Rapper Po",
      "sprite": "rapper_po",
      "hp": 540,
      "speed": 260,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Chop Stick Poke",
          "melee",
          30,
          0.28
        ],
        [
          "2",
          "Noodle Charge",
          "rush",
          46,
          0.9
        ],
        [
          "3",
          "Burning Noodles",
          "burning",
          38,
          2.4
        ],
        [
          "4",
          "Rap Battle",
          "cinematic",
          98,
          12
        ]
      ],
      "theme": [
        "#edc974",
        "noodles"
      ],
      "ultimate": [
        "Rap Battle",
        "cinematic",
        180
      ]
    },
    "iviv": {
      "name": "Iviv",
      "sprite": "iviv",
      "hp": 500,
      "speed": 270,
      "jump": 680,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Close Combat",
          "melee",
          30,
          0.27
        ],
        [
          "2",
          "Evil Blitz",
          "rush",
          45,
          0.9
        ],
        [
          "3",
          "Fire Arrow Brid",
          "projectile",
          46,
          2.1
        ],
        [
          "4",
          "Mental Attack",
          "cinematic",
          96,
          12
        ]
      ],
      "theme": [
        "#fa755b",
        "fire"
      ],
      "ultimate": [
        "Mental Attack",
        "cinematic",
        180
      ]
    },
    "kyrara": {
      "name": "Kyrara",
      "sprite": "kyrara",
      "hp": 510,
      "speed": 260,
      "jump": 690,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Chill Out",
          "melee",
          29,
          0.28
        ],
        [
          "2",
          "Ice Skating",
          "rush",
          44,
          0.9
        ],
        [
          "3",
          "Ice Brick",
          "projectile",
          40,
          2
        ],
        [
          "4",
          "Hell Splicing Fire Floor",
          "cinematic",
          100,
          12
        ]
      ],
      "theme": [
        "#a2eaff",
        "ice"
      ],
      "ultimate": [
        "Hell Splicing Fire Floor",
        "cinematic",
        180
      ]
    },
    "jarona": {
      "name": "Jerona Man",
      "sprite": "jarona",
      "hp": 560,
      "speed": 238,
      "jump": 630,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Jarona Punch",
          "melee",
          36,
          0.32
        ],
        [
          "2",
          "Jarona Dash",
          "rush",
          46,
          1
        ],
        [
          "3",
          "Jarona Beam",
          "projectile",
          50,
          2.8
        ],
        [
          "4",
          "Jarona!",
          "cinematic",
          95,
          12
        ]
      ],
      "theme": [
        "#d8ef6b",
        "leaf"
      ],
      "ultimate": [
        "Jarona!",
        "cinematic",
        180
      ]
    },
    "michaels_mech": {
      "name": "Michael’s Mech",
      "sprite": "michaels_mech",
      "hp": 920,
      "speed": 230,
      "jump": 600,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Mech Smash",
          "melee",
          38,
          0.35
        ],
        [
          "2",
          "Belly Slap",
          "rush",
          54,
          1
        ],
        [
          "3",
          "Mech Beam",
          "projectile",
          48,
          2.1
        ],
        [
          "4",
          "Overtime Cannon",
          "cinematic",
          108,
          12
        ]
      ],
      "scale": 1.55,
      "theme": [
        "#ff814d",
        "rocket"
      ],
      "ultimate": [
        "Overtime Cannon",
        "cinematic",
        180
      ]
    },
    "jane_juliet": {
      "name": "Jane Juliet",
      "sprite": "jane_juliet",
      "hp": 720,
      "speed": 255,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Juliet Strike",
          "melee",
          30,
          0.3
        ],
        [
          "2",
          "Rage Rush",
          "rush",
          44,
          0.9
        ],
        [
          "3",
          "Red Line",
          "projectile",
          42,
          2.2
        ],
        [
          "4",
          "Rage Domain",
          "cinematic",
          88,
          12
        ]
      ],
      "theme": [
        "#94edff",
        "beam"
      ],
      "ultimate": [
        "Rage Domain",
        "cinematic",
        180
      ]
    },
    "ranami": {
      "name": "Ronami",
      "sprite": "ronami",
      "hp": 710,
      "speed": 260,
      "jump": 690,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Wave Hit",
          "melee",
          29,
          0.3
        ],
        [
          "2",
          "Current Rush",
          "rush",
          43,
          0.9
        ],
        [
          "3",
          "Water Shot",
          "projectile",
          41,
          2.1
        ],
        [
          "4",
          "Tidal Domain",
          "cinematic",
          88,
          12
        ]
      ],
      "theme": [
        "#dcdfe5",
        "blade"
      ],
      "ultimate": [
        "Tidal Domain",
        "cinematic",
        180
      ]
    },
    "rogo": {
      "name": "Rogo",
      "sprite": "rogo",
      "hp": 800,
      "speed": 260,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Rogo Punch",
          "melee",
          32,
          0.3
        ],
        [
          "2",
          "Rogo Rush",
          "rush",
          46,
          0.9
        ],
        [
          "3",
          "Rogo Blast",
          "projectile",
          45,
          2.1
        ],
        [
          "4",
          "Rogo Domain",
          "cinematic",
          92,
          12
        ]
      ],
      "theme": [
        "#e99842",
        "fire"
      ],
      "ultimate": [
        "Rogo Domain",
        "cinematic",
        180
      ]
    },
    "ragon": {
      "name": "Ragon",
      "sprite": "ragon",
      "hp": 840,
      "speed": 265,
      "jump": 700,
      "ai": "boss",
      "abilities": [
        [
          "1",
          "Ragon Strike",
          "melee",
          33,
          0.3
        ],
        [
          "2",
          "Ragon Rush",
          "rush",
          48,
          0.9
        ],
        [
          "3",
          "Ragon Blast",
          "projectile",
          46,
          2
        ],
        [
          "4",
          "Ragon Domain",
          "cinematic",
          98,
          12
        ]
      ],
      "theme": [
        "#999dda",
        "water"
      ],
      "ultimate": [
        "Ragon Domain",
        "cinematic",
        180
      ]
    },
    "ironman_polyester": {
      "name": "Iron Man Polyester Edit",
      "sprite": "ironman_polyester",
      "hp": 1100,
      "speed": 245,
      "jump": 630,
      "ai": "boss",
      "abilities": [
        [
          "1",
          "Polyester Punch",
          "melee",
          36,
          0.32
        ],
        [
          "2",
          "Suit Charge",
          "rush",
          52,
          1
        ],
        [
          "3",
          "Polyester Beam",
          "projectile",
          48,
          2.1
        ],
        [
          "4",
          "Iron Man Polyester Edit",
          "cinematic",
          108,
          12
        ]
      ],
      "theme": [
        "#ffb060",
        "beam"
      ],
      "ultimate": [
        "Iron Man Polyester Edit",
        "cinematic",
        180
      ]
    },
    "aqua_mech": {
      "name": "Aqua Mech 1.0",
      "sprite": "aqua_mech",
      "hp": 720,
      "speed": 245,
      "jump": 650,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Out of Body Knives",
          "melee",
          48,
          0.65
        ],
        [
          "2",
          "Jet Thrusters",
          "rush",
          66,
          2
        ],
        [
          "3",
          "Omega Attack",
          "projectile",
          92,
          4
        ],
        [
          "4",
          "Self Destruct",
          "selfdestruct",
          300,
          22
        ]
      ],
      "theme": [
        "#84f5ff",
        "knife"
      ],
      "ultimate": [
        "Self Destruct",
        "selfdestruct",
        480
      ]
    },
    "dart_monkey": {
      "name": "Dart Monkey",
      "sprite": "dart_monkey",
      "hp": 460,
      "speed": 295,
      "jump": 720,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Dart",
          "projectile",
          25,
          0.2
        ],
        [
          "2",
          "24 Darts/sec",
          "projectile",
          38,
          0.5
        ],
        [
          "3",
          "Taco Sauce",
          "blast",
          52,
          2.1
        ],
        [
          "4",
          "$2 Bill Save",
          "cinematic",
          88,
          12
        ]
      ],
      "theme": [
        "#e6ab4e",
        "dart"
      ],
      "ultimate": [
        "$2 Bill Save",
        "cinematic",
        180
      ]
    },
    "registar": {
      "name": "Reggie Star",
      "sprite": "registar",
      "hp": 640,
      "speed": 240,
      "jump": 650,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Strike",
          "melee",
          29,
          0.3
        ],
        [
          "2",
          "Burst",
          "projectile",
          38,
          0.9
        ],
        [
          "3",
          "Pressure",
          "blast",
          55,
          2.5
        ],
        [
          "4",
          "Domain Pressure",
          "cinematic",
          90,
          12
        ]
      ],
      "theme": [
        "#efdfa6",
        "receipt"
      ],
      "ultimate": [
        "Domain Pressure",
        "cinematic",
        180
      ]
    },
    "ryu": {
      "name": "Ryu Fushiguro",
      "sprite": "ryu",
      "hp": 760,
      "speed": 270,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Heavy Hit",
          "melee",
          34,
          0.28
        ],
        [
          "2",
          "Rush",
          "rush",
          46,
          0.9
        ],
        [
          "3",
          "Blast",
          "projectile",
          52,
          1.8
        ],
        [
          "4",
          "DOMAIN TENKAI",
          "cinematic",
          102,
          12
        ]
      ],
      "theme": [
        "#b7a0ec",
        "beam"
      ],
      "ultimate": [
        "DOMAIN TENKAI",
        "cinematic",
        180
      ]
    },
    "uro": {
      "name": "Uro Zenin",
      "sprite": "uro",
      "hp": 650,
      "speed": 260,
      "jump": 700,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Sky Hit",
          "melee",
          28,
          0.3
        ],
        [
          "2",
          "Warp",
          "rush",
          42,
          0.9
        ],
        [
          "3",
          "Sky Blast",
          "projectile",
          48,
          1.8
        ],
        [
          "4",
          "DOMAIN TENKAI",
          "cinematic",
          96,
          12
        ]
      ],
      "theme": [
        "#ffadc7",
        "sky"
      ],
      "ultimate": [
        "DOMAIN TENKAI",
        "cinematic",
        180
      ]
    },
    "hazanoki": {
      "name": "Hazenoki",
      "sprite": "hazanoki",
      "hp": 700,
      "speed": 250,
      "jump": 660,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Strike",
          "melee",
          30,
          0.3
        ],
        [
          "2",
          "Blast",
          "projectile",
          44,
          0.9
        ],
        [
          "3",
          "Bomb",
          "blast",
          58,
          2.5
        ],
        [
          "4",
          "DOMAIN TENKAI",
          "cinematic",
          100,
          12
        ]
      ],
      "theme": [
        "#ff9e31",
        "bomb"
      ],
      "ultimate": [
        "DOMAIN TENKAI",
        "cinematic",
        180
      ]
    },
    "scientist": {
      "name": "Lab Security",
      "sprite": "scientist",
      "hp": 135,
      "speed": 190,
      "jump": 580,
      "ai": "coward",
      "abilities": [
        [
          "1",
          "Clipboard",
          "melee",
          14,
          0.7
        ],
        [
          "2",
          "Test Vial",
          "projectile",
          15,
          1.2
        ],
        [
          "3",
          "Panic",
          "rush",
          10,
          2.8
        ],
        [
          "4",
          "Security Alarm",
          "blast",
          20,
          6
        ]
      ],
      "theme": [
        "#78cdd1",
        "vial"
      ],
      "ultimate": [
        "Security Alarm",
        "blast",
        180
      ]
    },
    "normal_rombie": {
      "name": "Rombie",
      "sprite": "normal_rombie",
      "hp": 150,
      "speed": 150,
      "jump": 500,
      "ai": "swarm",
      "abilities": [
        [
          "1",
          "Brainzz Bite",
          "melee",
          22,
          0.65
        ],
        [
          "2",
          "Lunge",
          "rush",
          24,
          1.3
        ],
        [
          "3",
          "Brainzz",
          "blast",
          20,
          3
        ],
        [
          "4",
          "Rombie Rush",
          "rush",
          35,
          5
        ]
      ],
      "theme": [
        "#9bad74",
        "bite"
      ],
      "ultimate": [
        "Rombie Rush",
        "rush",
        180
      ]
    },
    "flying_rombie": {
      "name": "Flying Rombie",
      "sprite": "flying_rombie",
      "hp": 130,
      "speed": 240,
      "jump": 900,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Wing Bite",
          "melee",
          20,
          0.55
        ],
        [
          "2",
          "Dive",
          "rush",
          28,
          1
        ],
        [
          "3",
          "Drop Rombie",
          "projectile",
          24,
          2
        ],
        [
          "4",
          "Sky Swarm",
          "cinematic",
          44,
          12
        ]
      ],
      "theme": [
        "#bac8dc",
        "feather"
      ],
      "ultimate": [
        "Sky Swarm",
        "cinematic",
        180
      ]
    },
    "rombie_mech": {
      "name": "Rombie Mech",
      "sprite": "rombie_mech",
      "hp": 480,
      "speed": 155,
      "jump": 420,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Mech Slam",
          "melee",
          32,
          0.7
        ],
        [
          "2",
          "Rombie Beam",
          "projectile",
          28,
          1.2
        ],
        [
          "3",
          "Ground Pound",
          "blast",
          46,
          2.8
        ],
        [
          "4",
          "Mech Barrage",
          "cinematic",
          72,
          12
        ]
      ],
      "theme": [
        "#73ab87",
        "bomb"
      ],
      "ultimate": [
        "Mech Barrage",
        "cinematic",
        180
      ]
    },
    "grasshopper": {
      "name": "Grasshopper Rombie",
      "sprite": "grasshopper",
      "hp": 520,
      "speed": 310,
      "jump": 820,
      "ai": "hyper",
      "abilities": [
        [
          "1",
          "Grass Kick",
          "melee",
          31,
          0.3
        ],
        [
          "2",
          "Hop Crush",
          "rush",
          42,
          0.9
        ],
        [
          "3",
          "Wing Slice",
          "projectile",
          38,
          1.7
        ],
        [
          "4",
          "Mori Mori Radioooo",
          "cinematic",
          82,
          12
        ]
      ],
      "theme": [
        "#bed78e",
        "blade"
      ],
      "ultimate": [
        "Mori Mori Radioooo",
        "cinematic",
        180
      ]
    },
    "rohito": {
      "name": "Rohito",
      "sprite": "rohito",
      "hp": 1100,
      "speed": 300,
      "jump": 720,
      "ai": "rohito",
      "abilities": [
        [
          "1",
          "MUDA",
          "melee",
          31,
          0.22
        ],
        [
          "2",
          "WHITE SLOW",
          "projectile",
          41,
          0.72
        ],
        [
          "3",
          "SLASH / DIHMANTLE",
          "rush",
          60,
          2.2
        ],
        [
          "4",
          "DOMAIN EXPANSION",
          "cinematic",
          106,
          12
        ]
      ],
      "forms": [
        "rohito",
        "rohito_evo"
      ],
      "theme": [
        "#b9c5da",
        "blade"
      ],
      "ultimate": [
        "DOMAIN EXPANSION",
        "cinematic",
        180
      ]
    },
    "sukuna": {
      "name": "Sukuna — King of Kindness",
      "sprite": "sukuna",
      "hp": 1050,
      "speed": 245,
      "jump": 650,
      "ai": "sukuna",
      "abilities": [
        [
          "1",
          "Trident Hit",
          "melee",
          31,
          0.35
        ],
        [
          "2",
          "KAMUTOKE",
          "projectile",
          46,
          0.95
        ],
        [
          "3",
          "OPEN",
          "blast",
          62,
          2.8
        ],
        [
          "4",
          "FUGA",
          "cinematic",
          118,
          12
        ]
      ],
      "theme": [
        "#ff6961",
        "fire"
      ],
      "ultimate": [
        "FUGA",
        "cinematic",
        188.8
      ]
    },
    "dr_doom_2099": {
      "name": "Dr Doom 2099",
      "sprite": "dr_doom_2099",
      "hp": 850,
      "speed": 220,
      "jump": 600,
      "ai": "tank",
      "abilities": [
        [
          "1",
          "Armor Smash",
          "melee",
          34,
          0.4
        ],
        [
          "2",
          "DRILL",
          "rush",
          45,
          1
        ],
        [
          "3",
          "PIGEON VIOLA",
          "projectile",
          54,
          2.2
        ],
        [
          "4",
          "Consumption Process",
          "cinematic",
          100,
          12
        ]
      ],
      "theme": [
        "#6eacce",
        "rocket"
      ],
      "ultimate": [
        "Consumption Process",
        "cinematic",
        180
      ]
    },
    "retep": {
      "name": "Retep",
      "sprite": "retep",
      "hp": 1250,
      "speed": 300,
      "jump": 710,
      "ai": "retep",
      "abilities": [
        [
          "1",
          "Uppercut Slash",
          "melee",
          35,
          0.25
        ],
        [
          "2",
          "Phonk Blast",
          "projectile",
          46,
          0.75
        ],
        [
          "3",
          "Polyester",
          "blast",
          65,
          2.4
        ],
        [
          "4",
          "JAK DOES SNACKS",
          "cinematic",
          115,
          12
        ]
      ],
      "theme": [
        "#dca5dd",
        "wave"
      ],
      "ultimate": [
        "JAK DOES SNACKS",
        "cinematic",
        184
      ]
    },
    "professor_dave": {
      "name": "Professor Dave",
      "sprite": "professor_dave",
      "hp": 700,
      "speed": 235,
      "jump": 640,
      "ai": "professor",
      "abilities": [
        [
          "1",
          "Lecture Tap",
          "melee",
          22,
          0.45
        ],
        [
          "2",
          "Explanation",
          "projectile",
          30,
          1
        ],
        [
          "3",
          "Peck Attack",
          "rush",
          48,
          2
        ],
        [
          "4",
          "DOMAIN: EXPLAINS",
          "cinematic",
          82,
          12
        ]
      ],
      "theme": [
        "#e6c893",
        "book"
      ],
      "ultimate": [
        "DOMAIN: EXPLAINS",
        "cinematic",
        180
      ]
    },
    "spamton_neo": {
      "name": "Spamton NEO",
      "sprite": "spamton_neo",
      "hp": 780,
      "speed": 330,
      "jump": 760,
      "ai": "spamton",
      "abilities": [
        [
          "1",
          "Kromer Kick",
          "melee",
          29,
          0.3
        ],
        [
          "2",
          "PIPIS",
          "projectile",
          38,
          0.65
        ],
        [
          "3",
          "GET OVER HERE",
          "rush",
          52,
          1.8
        ],
        [
          "4",
          "[DEATH] DEAL",
          "cinematic",
          94,
          12
        ]
      ],
      "theme": [
        "#e570de",
        "pipis"
      ],
      "ultimate": [
        "[DEATH] DEAL",
        "cinematic",
        180
      ]
    },
    "super_monkey_fan": {
      "name": "Super Monkey Fan Club",
      "sprite": "super_monkey_fan",
      "hp": 820,
      "speed": 300,
      "jump": 760,
      "ai": "monkey",
      "abilities": [
        [
          "1",
          "Dart Spam",
          "projectile",
          24,
          0.22
        ],
        [
          "2",
          "Monkey Rush",
          "rush",
          46,
          3
        ],
        [
          "3",
          "Fan Club Barrage",
          "barrage",
          8,
          5
        ],
        [
          "4",
          "Fan Club Rally",
          "cinematic",
          98,
          16
        ]
      ],
      "theme": [
        "#e7b776",
        "dart"
      ],
      "ultimate": [
        "Fan Club Rally",
        "cinematic",
        180
      ]
    },
    "saul": {
      "name": "Saul (Better Call Him)",
      "sprite": "saul",
      "hp": 760,
      "speed": 235,
      "jump": 630,
      "ai": "saul",
      "abilities": [
        [
          "1",
          "Objection",
          "melee",
          26,
          0.4
        ],
        [
          "2",
          "Evidence",
          "projectile",
          34,
          1
        ],
        [
          "3",
          "Retrial",
          "blast",
          52,
          2.4
        ],
        [
          "4",
          "COURTROOM DOMAIN",
          "cinematic",
          88,
          12
        ]
      ],
      "theme": [
        "#ffea4e",
        "gavel"
      ],
      "ultimate": [
        "COURTROOM DOMAIN",
        "cinematic",
        180
      ]
    },
    "blue_line_enemy": {
      "name": "Reggie Star",
      "sprite": "registar",
      "hp": 820,
      "speed": 265,
      "jump": 680,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Receipt Strike",
          "melee",
          29,
          0.6
        ],
        [
          "2",
          "Contractual Re-Creation",
          "projectile",
          38,
          2
        ],
        [
          "3",
          "Receipt Barrage",
          "blast",
          58,
          4
        ],
        [
          "4",
          "Contract Fulfilled",
          "cinematic",
          102,
          16
        ]
      ],
      "theme": [
        "#efdfa6",
        "receipt"
      ],
      "ultimate": [
        "Contract Fulfilled",
        "cinematic",
        190
      ]
    },
    "kurocust": {
      "name": "Kurocust Guy",
      "sprite": "kurocust",
      "hp": 820,
      "speed": 255,
      "jump": 670,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Claw",
          "melee",
          31,
          0.3
        ],
        [
          "2",
          "Domain Break",
          "blast",
          56,
          1.8
        ],
        [
          "3",
          "Interruption",
          "rush",
          48,
          2
        ],
        [
          "4",
          "DOMAIN BREAKER",
          "cinematic",
          94,
          12
        ]
      ],
      "theme": [
        "#c9ad86",
        "claw"
      ],
      "ultimate": [
        "DOMAIN BREAKER",
        "cinematic",
        180
      ]
    },
    "sendai_enemy": {
      "name": "Sendai Domain User",
      "sprite": "sendai_enemy",
      "hp": 850,
      "speed": 275,
      "jump": 690,
      "ai": "boss",
      "abilities": [
        [
          "1",
          "Colony Hit",
          "melee",
          30,
          0.28
        ],
        [
          "2",
          "Phonk Point",
          "projectile",
          42,
          0.75
        ],
        [
          "3",
          "Domain Pressure",
          "blast",
          58,
          2.2
        ],
        [
          "4",
          "DOMAIN TENKAI",
          "cinematic",
          104,
          12
        ]
      ],
      "theme": [
        "#a7aff9",
        "beam"
      ],
      "ultimate": [
        "DOMAIN TENKAI",
        "cinematic",
        180
      ]
    },
    "giant_test_tube": {
      "name": "Giant Test Tube",
      "sprite": "giant_test_tube_ref",
      "hp": 900,
      "speed": 0,
      "jump": 0,
      "ai": "hazard",
      "abilities": [
        [
          "1",
          "Drop",
          "cinematic",
          48,
          14
        ],
        [
          "2",
          "Faster Return",
          "cinematic",
          58,
          18
        ],
        [
          "3",
          "Glass Burst",
          "blast",
          62,
          4
        ],
        [
          "4",
          "Serum Rain",
          "cinematic",
          90,
          12
        ]
      ],
      "theme": [
        "#82d9cd",
        "vial"
      ],
      "ultimate": [
        "Serum Rain",
        "cinematic",
        180
      ]
    },
    "barf_domain": {
      "name": "Barf Symptoms Domain",
      "sprite": "barf_domain",
      "hp": 850,
      "speed": 180,
      "jump": 520,
      "ai": "domain",
      "abilities": [
        [
          "1",
          "Bart",
          "projectile",
          26,
          0.7
        ],
        [
          "2",
          "Symptom Wave",
          "blast",
          40,
          1.8
        ],
        [
          "3",
          "Freeze Presence",
          "rush",
          48,
          2.5
        ],
        [
          "4",
          "DOMAIN EXPANSION",
          "cinematic",
          90,
          12
        ]
      ],
      "theme": [
        "#afce3f",
        "bart"
      ],
      "ultimate": [
        "DOMAIN EXPANSION",
        "cinematic",
        180
      ]
    },
    "skeleton": {
      "name": "Skeleton",
      "sprite": "skeleton",
      "hp": 620,
      "speed": 260,
      "jump": 680,
      "ai": "trickster",
      "abilities": [
        [
          "1",
          "Bone Hit",
          "melee",
          28,
          0.3
        ],
        [
          "2",
          "Rule Lock",
          "projectile",
          35,
          0.9
        ],
        [
          "3",
          "Hell Shift",
          "rush",
          44,
          1.8
        ],
        [
          "4",
          "No Abilities Here",
          "cinematic",
          80,
          12
        ]
      ],
      "theme": [
        "#ddddee",
        "bone"
      ],
      "ultimate": [
        "No Abilities Here",
        "cinematic",
        180
      ]
    },
    "kars": {
      "name": "Kars",
      "sprite": "kars",
      "hp": 1150,
      "speed": 260,
      "jump": 690,
      "ai": "boss",
      "abilities": [
        [
          "1",
          "Bone Blade",
          "melee",
          42,
          0.8
        ],
        [
          "2",
          "Immortal Rush",
          "rush",
          62,
          3
        ],
        [
          "3",
          "Sun Conqueror",
          "projectile",
          60,
          4
        ],
        [
          "4",
          "Ultimate Life Form",
          "cinematic",
          135,
          16
        ]
      ],
      "theme": [
        "#d491ff",
        "blade"
      ],
      "ultimate": [
        "Ultimate Life Form",
        "cinematic",
        216
      ]
    },
    "rombie_carrier": {
      "name": "Rombie Carrier",
      "sprite": "rombie_carrier",
      "hp": 1000,
      "speed": 85,
      "jump": 0,
      "scale": 1.65,
      "ai": "carrier",
      "abilities": [
        [
          "1",
          "Carrier Ram",
          "rush",
          60,
          4
        ],
        [
          "2",
          "Serum Bomb",
          "projectile",
          50,
          3.4
        ],
        [
          "3",
          "Carrier Barrage",
          "blast",
          72,
          7
        ],
        [
          "4",
          "Rombie Drop",
          "cinematic",
          90,
          18
        ]
      ],
      "theme": [
        "#89bf74",
        "bomb"
      ],
      "ultimate": [
        "Rombie Drop",
        "cinematic",
        180
      ]
    },
    "rombie_raleigh": {
      "name": "Raleigh (Rombie)",
      "sprite": "rombie_raleigh",
      "hp": 640,
      "speed": 290,
      "jump": 700,
      "ai": "hyper",
      "abilities": [
        [
          "1",
          "Buffed White Owl Lift",
          "lift",
          85,
          3
        ],
        [
          "2",
          "Rombie Peck",
          "rush",
          72,
          1.8
        ],
        [
          "3",
          "Cuellar’s Will",
          "protector",
          260,
          9
        ],
        [
          "4",
          "Rombie Storm",
          "cinematic",
          100,
          16
        ]
      ],
      "standAbilities": null,
      "standName": "White Owl",
      "standSprite": "white_owl",
      "rombieAbilities": [
        [
          "1",
          "Buffed White Owl Lift",
          "lift",
          85,
          3
        ],
        [
          "2",
          "Rombie Peck",
          "rush",
          72,
          1.8
        ],
        [
          "3",
          "Cuellar’s Will",
          "protector",
          260,
          9
        ],
        [
          "4",
          "Return to Raleigh",
          "rombie_toggle",
          0,
          0.5
        ]
      ],
      "theme": [
        "#a6c357",
        "feather"
      ],
      "ultimate": [
        "Rombie Storm",
        "cinematic",
        180
      ]
    },
    "vessel": {
      "name": "Vessel",
      "sprite": "vessel",
      "hp": 600,
      "speed": 250,
      "jump": 680,
      "ai": "brawler",
      "abilities": [
        [
          "1",
          "Vessel Strike",
          "melee",
          32,
          0.5
        ],
        [
          "2",
          "Soul Dash",
          "rush",
          50,
          2
        ],
        [
          "3",
          "Black Flash",
          "blast",
          60,
          4
        ],
        [
          "4",
          "Vessel Resolve",
          "selfprotect",
          200,
          9
        ]
      ],
      "theme": [
        "#f49388",
        "fist"
      ],
      "ultimate": [
        "Vessel Resolve",
        "selfprotect",
        320
      ]
    },
    "oliver_hvnly": {
      "name": "Oliver (HVNLY)",
      "sprite": "oliver_hvnly",
      "hp": 1250,
      "speed": 320,
      "jump": 670,
      "ai": "zoner",
      "abilities": [
        [
          "1",
          "Heavenly Jab",
          "melee",
          46,
          0.35
        ],
        [
          "2",
          "24 Darts Per Second",
          "barrage",
          13,
          3
        ],
        [
          "3",
          "Heavenly Fire Bird",
          "burning",
          82,
          4
        ],
        [
          "4",
          "Heavenly Light Novel",
          "cinematic",
          210,
          14
        ]
      ],
      "theme": [
        "#fff2ba",
        "dart"
      ],
      "ultimate": [
        "Heavenly Light Novel",
        "cinematic",
        336
      ]
    }
  },
  "BATTLES": [
    {
      "id": "lab",
      "title": "1. LAB BREAKOUT",
      "sub": "Metal Sonic escapes the experiment",
      "rooms": [
        "lab",
        "lab_outside"
      ],
      "party": [
        "metal_sonic"
      ],
      "waves": [
        {
          "room": 0,
          "enemies": [
            [
              "scientist",
              4
            ]
          ],
          "objective": "Escape the capsule room"
        },
        {
          "room": 0,
          "enemies": [
            [
              "scientist",
              2
            ],
            [
              "normal_rombie",
              3
            ]
          ],
          "objective": "Clear the lab and reach the exit"
        },
        {
          "room": 1,
          "enemies": [
            [
              "normal_rombie",
              5
            ],
            [
              "rombie_mech",
              1
            ]
          ],
          "objective": "Break through the Rombie swarm"
        }
      ],
      "pre": [
        {
          "speaker": "Scientist",
          "text": "In that capsule there was an experiment and then… BOOM!!!!!",
          "portrait": "scientist"
        },
        {
          "speaker": "Scientist",
          "text": "Please don’t kill us.",
          "portrait": "scientist"
        },
        {
          "speaker": "Metal Sonic",
          "text": "NOE",
          "portrait": "metal_sonic"
        },
        {
          "speaker": "Scientist",
          "text": "I Have to get out of here",
          "portrait": "scientist"
        },
        {
          "speaker": "Metal Sonic",
          "text": "NOT so fast",
          "portrait": "metal_sonic"
        }
      ],
      "waveLines": {
        "1": [
          {
            "speaker": "Metal Sonic",
            "text": "I need to get out of here.",
            "portrait": "metal_sonic"
          }
        ],
        "2": [
          {
            "speaker": "Rombies",
            "text": "BRAINZZZ.",
            "portrait": "normal_rombie"
          },
          {
            "speaker": "Metal Sonic",
            "text": "Ok now you die.",
            "portrait": "metal_sonic"
          }
        ]
      },
      "post": [
        {
          "speaker": "Metal Sonic",
          "text": "Yes. The chaos emerald is in my grasp.",
          "portrait": "metal_sonic"
        },
        {
          "speaker": "Metal Sonic",
          "text": "I am POWERFUL. Now it is time for me to get the master emerald.",
          "portrait": "metal_sonic"
        }
      ]
    },
    {
      "id": "desert",
      "title": "2. MIGHTY EAGLE — DESERT CONVOY",
      "sub": "Survive the Rombie chase",
      "rooms": [
        "desert"
      ],
      "party": [
        "raleigh",
        "mighty_eagle"
      ],
      "waves": [
        {
          "enemies": [
            [
              "normal_rombie",
              6
            ]
          ],
          "objective": "Survive the convoy ambush"
        },
        {
          "enemies": [
            [
              "flying_rombie",
              4
            ],
            [
              "normal_rombie",
              4
            ]
          ],
          "objective": "Hold the line"
        },
        {
          "enemies": [],
          "objective": "Mighty Eagle holds back the horde"
        }
      ],
      "pre": [
        {
          "speaker": "Raleigh",
          "text": "I think we’re cooked.",
          "portrait": "raleigh"
        },
        {
          "speaker": "Mighty Eagle",
          "text": "MIGH-TY EA-GLE. HAYYY YOOOO AHHHHHH",
          "portrait": "mighty_eagle"
        }
      ],
      "waveLines": {
        "2": [
          {
            "speaker": "Mighty Eagle",
            "text": "Go, I will fend them off.",
            "portrait": "mighty_eagle"
          },
          {
            "speaker": "Raleigh",
            "text": "Ok. Come on, let’s go!",
            "portrait": "raleigh"
          }
        ]
      },
      "post": [
        {
          "speaker": "Raleigh",
          "text": "That was way too close.",
          "portrait": "raleigh"
        }
      ]
    },
    {
      "id": "backrooms",
      "title": "3. BACKROOMS MAZE",
      "sub": "Find the exit through the shifting rooms",
      "rooms": [
        "backrooms"
      ],
      "party": [
        "raleigh",
        "ada",
        "raph"
      ],
      "maze": true,
      "pre": [
        {
          "speaker": "Raleigh",
          "text": "Where are we?",
          "portrait": "raleigh"
        },
        {
          "speaker": "Ada",
          "text": "Some robot hedgehog just sent me here.",
          "portrait": "ada"
        },
        {
          "speaker": "Raph",
          "text": "Let’s find a way out. Search the dead ends for three portal fragments.",
          "portrait": "raph"
        }
      ],
      "post": [
        {
          "speaker": "Raleigh",
          "text": "Vivi, can you make a portal?",
          "portrait": "raleigh"
        },
        {
          "speaker": "Vivi",
          "text": "Sure. Come on, everyone!",
          "portrait": "vivi",
          "action": {
            "type": "portal"
          }
        }
      ]
    },
    {
      "id": "sukuna",
      "title": "4. THE KING OF KINDNESS",
      "sub": "Boat Ark boss battle",
      "rooms": [
        "boat"
      ],
      "party": [
        "ada",
        "choso",
        "leonard"
      ],
      "waves": [
        {
          "enemies": [
            [
              "sukuna",
              1
            ]
          ],
          "objective": "Defeat Sukuna — Phase 1"
        }
      ],
      "boss": "sukuna",
      "mid": [
        {
          "at": 0.76,
          "lines": [
            {
              "speaker": "Sukuna",
              "text": "KAMUTOKE.",
              "portrait": "sukuna"
            },
            {
              "speaker": "Ada",
              "text": "JAY YOU GOTTA MOVE",
              "portrait": "ada"
            }
          ],
          "move": "KAMUTOKE",
          "action": "choso_ashes"
        },
        {
          "at": 0.53,
          "lines": [
            {
              "speaker": "Sukuna",
              "text": "OPEN.",
              "portrait": "sukuna"
            },
            {
              "speaker": "Choso",
              "text": "Piercing blood",
              "portrait": "choso"
            }
          ],
          "move": "OPEN"
        },
        {
          "at": 0.28,
          "lines": [
            {
              "speaker": "Sukuna",
              "text": "Whatever .OPEN… FUGA",
              "portrait": "sukuna"
            },
            {
              "speaker": "Choso",
              "text": "Oh crap.",
              "portrait": "choso"
            }
          ],
          "move": "FUGA"
        }
      ],
      "pre": [
        {
          "speaker": "Ada",
          "text": "Uhh… what is that?",
          "portrait": "ada"
        },
        {
          "speaker": "Leonard",
          "text": "It’s the king of kindness sukuna",
          "portrait": "leonard"
        }
      ],
      "post": [
        {
          "speaker": "Leonard",
          "text": "ACID SPIT!",
          "portrait": "leonard"
        },
        {
          "speaker": "Ada",
          "text": "Wait—who is driving the ship?",
          "portrait": "ada"
        },
        {
          "speaker": "Raleigh",
          "text": "Me.",
          "portrait": "raleigh"
        },
        {
          "speaker": "Ada",
          "text": "OH CRAP.",
          "portrait": "ada"
        }
      ]
    },
    {
      "id": "overtime",
      "title": "5. OVERTIME SHOWDOWN",
      "sub": "Rohito and Michael’s Mech",
      "rooms": [
        "dam",
        "overtime_domain"
      ],
      "party": [
        "rohito"
      ],
      "waves": [
        {
          "room": 0,
          "enemies": [
            [
              "michaels_mech",
              1
            ]
          ],
          "objective": "Defeat Michael’s Mech"
        }
      ],
      "boss": "michaels_mech",
      "mid": [
        {
          "at": 0.78,
          "lines": [
            {
              "speaker": "Rohito",
              "text": "I’ll tear through the armor.",
              "portrait": "rohito"
            }
          ],
          "move": "MUDA"
        },
        {
          "at": 0.55,
          "lines": [
            {
              "speaker": "Rohito",
              "text": "DOMAIN EXPANSION.",
              "portrait": "rohito"
            }
          ],
          "move": "DOMAIN EXPANSION",
          "room": 1
        }
      ],
      "pre": [
        {
          "speaker": "Rohito",
          "text": "Michael, I’m coming for you.",
          "portrait": "rohito"
        },
        {
          "speaker": "Michael’s Mech",
          "text": "You have to get through the mech first.",
          "portrait": "michaels_mech"
        }
      ],
      "post": [
        {
          "speaker": "Rohito",
          "text": "Now you’re next, Michael!",
          "portrait": "rohito"
        },
        {
          "speaker": "Michael",
          "text": "BELLY SLAP!",
          "portrait": "michael",
          "action": {
            "type": "belly_slap"
          }
        },
        {
          "speaker": "Rohito",
          "text": "A physical attack… I barely survived. I have to get out of here.",
          "portrait": "rohito"
        }
      ]
    },
    {
      "id": "eagle_rescue",
      "title": "6. MIGHTY EAGLE — LOST IN SHIBUYA",
      "sub": "Jane Juliet, Ronami, Rogo and Retep",
      "rooms": [
        "shibuya"
      ],
      "party": [
        "mighty_eagle"
      ],
      "waves": [
        {
          "enemies": [
            [
              "jane_juliet",
              1
            ],
            [
              "ranami",
              1
            ],
            [
              "rogo",
              1
            ],
            [
              "retep",
              1
            ]
          ],
          "objective": "Defeat the four pursuers"
        }
      ],
      "boss": "retep",
      "pre": [
        {
          "speaker": "Mighty Eagle",
          "text": "I got separated from the others. Bring it on!",
          "portrait": "mighty_eagle"
        }
      ],
      "post": [
        {
          "speaker": "Mighty Eagle",
          "text": "I’m going to splatter your atoms all over Shibuya!",
          "portrait": "mighty_eagle"
        }
      ]
    },
    {
      "id": "station",
      "title": "7. SHIBUYA ROMBIE HUNT",
      "sub": "Ada and Rapper Po vs. Grasshopper Rombie",
      "rooms": [
        "station_deep"
      ],
      "party": [
        "ada",
        "rapper_po"
      ],
      "waves": [
        {
          "enemies": [
            [
              "grasshopper",
              1
            ]
          ],
          "objective": "Defeat the Grasshopper Rombie"
        }
      ],
      "boss": "grasshopper",
      "pre": [
        {
          "speaker": "Ada",
          "text": "The grasshopper rombie is in here. Stay close.",
          "portrait": "ada"
        }
      ],
      "waveLines": {
        "0": [
          {
            "speaker": "Radio",
            "text": "Mori mori morii… Mori moncho radioooo!",
            "portrait": "scientist"
          },
          {
            "speaker": "Grasshopper Rombie",
            "text": "What?",
            "portrait": "grasshopper"
          },
          {
            "speaker": "Ada",
            "text": "Rapper Po, hit it with the noodles!",
            "portrait": "ada"
          },
          {
            "speaker": "Rapper Po",
            "text": "Noodles Attack!",
            "portrait": "rapper_po"
          }
        ]
      },
      "post": [
        {
          "speaker": "Rapper Po",
          "text": "Let me heal with my noodles rq.",
          "portrait": "rapper_po"
        },
        {
          "speaker": "Ada",
          "text": "Let’s get to the others.",
          "portrait": "ada"
        }
      ]
    },
    {
      "id": "ragon_rogo",
      "title": "8. RAGON AND ROGO",
      "sub": "Oliver, Rapper Po, Vivi and Raph vs. Ragon and Rogo",
      "rooms": [
        "shibuya"
      ],
      "party": [
        "oliver",
        "rapper_po",
        "vivi",
        "raph"
      ],
      "waves": [
        {
          "enemies": [
            [
              "ragon",
              1
            ],
            [
              "rogo",
              1
            ]
          ],
          "objective": "Defeat Ragon and Rogo"
        }
      ],
      "boss": "ragon",
      "pre": [
        {
          "speaker": "Oliver",
          "text": "We found them. Everyone, get ready.",
          "portrait": "oliver"
        },
        {
          "speaker": "Rapper Po",
          "text": "Noodles are locked and loaded.",
          "portrait": "rapper_po"
        }
      ],
      "post": [
        {
          "speaker": "Raph",
          "text": "That should clear the way.",
          "portrait": "raph"
        }
      ],
      "initialForms": {
        "raph": 1
      }
    },
    {
      "id": "iviv_rogo",
      "title": "9. IVIV VS ROGO",
      "sub": "A one-on-one rematch",
      "rooms": [
        "shibuya"
      ],
      "party": [
        "iviv"
      ],
      "waves": [
        {
          "enemies": [
            [
              "rogo",
              1
            ]
          ],
          "objective": "Defeat Rogo"
        }
      ],
      "boss": "rogo",
      "pre": [
        {
          "speaker": "Iviv",
          "text": "I’ll handle Rogo alone.",
          "portrait": "iviv"
        }
      ],
      "post": [
        {
          "speaker": "Iviv",
          "text": "That settles it.",
          "portrait": "iviv"
        }
      ]
    },
    {
      "id": "polyester_edit",
      "title": "10. IRON MAN POLYESTER EDIT",
      "sub": "Iviv and Kyrara vs. the armored edit",
      "rooms": [
        "polyester_city"
      ],
      "party": [
        "iviv",
        "kyrara"
      ],
      "waves": [
        {
          "enemies": [
            [
              "ironman_polyester",
              1
            ]
          ],
          "objective": "Defeat Iron Man Polyester Edit"
        }
      ],
      "boss": "ironman_polyester",
      "pre": [
        {
          "speaker": "Iviv",
          "text": "Oh, sup Kyrara.",
          "portrait": "iviv"
        },
        {
          "speaker": "Kyrara",
          "text": "Who is this?",
          "portrait": "kyrara"
        },
        {
          "speaker": "Leonard",
          "text": "With this polyester, I summon…",
          "portrait": "leonard",
          "action": {
            "type": "summon_enemy",
            "key": "ironman_polyester"
          }
        },
        {
          "speaker": "Leonard",
          "text": "Iron Man Polyester Edit!",
          "portrait": "leonard"
        },
        {
          "speaker": "Iviv",
          "text": "Oh, another insect.",
          "portrait": "iviv"
        }
      ],
      "post": [
        {
          "speaker": "Iviv",
          "text": "We stopped it.",
          "portrait": "iviv"
        }
      ],
      "waveAfterIntro": true
    },
    {
      "id": "rohito",
      "title": "11. ROHITO — ULTIMATE BEING",
      "sub": "Evolution battle",
      "rooms": [
        "station_deep",
        "rohito_field"
      ],
      "party": [
        "ada",
        "todo"
      ],
      "waves": [
        {
          "room": 0,
          "enemies": [
            [
              "rohito",
              1
            ]
          ],
          "objective": "Stop Rohito"
        }
      ],
      "boss": "rohito",
      "mid": [
        {
          "at": 0.82,
          "lines": [
            {
              "speaker": "Ada",
              "text": "WHAT THE HELL ARE YOU ROHITO",
              "portrait": "ada"
            },
            {
              "speaker": "Rohito",
              "text": "YOU DON’T HAVE TO SHOUT, I CAN HEAR YOU JUST FINE ADA!",
              "portrait": "rohito"
            },
            {
              "speaker": "Ada",
              "text": "Nah, that’s it, I’m evolving.",
              "portrait": "ada",
              "action": {
                "type": "evolve",
                "key": "ada",
                "form": 1
              }
            }
          ]
        },
        {
          "at": 0.6,
          "lines": [
            {
              "speaker": "Rohito",
              "text": "I TRULY AM A ROMBIE!",
              "portrait": "rohito",
              "action": {
                "type": "evolve",
                "key": "rohito",
                "form": 1
              }
            },
            {
              "speaker": "Ada",
              "text": "HE’S BECOME THE ULTIMATE BEING!",
              "portrait": "ada"
            }
          ]
        },
        {
          "at": 0.39,
          "room": 1,
          "lines": [
            {
              "speaker": "Ada",
              "text": "WHITE SLOW!! MUDA MUDA MUDA MUDA MUDAAA!",
              "portrait": "ada",
              "action": {
                "type": "evolve",
                "key": "ada",
                "form": 2
              }
            },
            {
              "speaker": "Todo",
              "text": "A WHOLE CHAIN!?",
              "portrait": "todo"
            },
            {
              "speaker": "Raph",
              "text": "Don’t worry, I brought help.",
              "portrait": "raph",
              "action": {
                "type": "join",
                "key": "raph",
                "form": 2
              }
            }
          ],
          "move": "WHITE SLOW",
          "caster": "ada"
        },
        {
          "at": 0.18,
          "lines": [
            {
              "speaker": "Rohito",
              "text": "THAT’S IT. SLASH.",
              "portrait": "rohito"
            },
            {
              "speaker": "Todo",
              "text": "NO, I’M NOT DOING THIS AGAIN!",
              "portrait": "todo"
            },
            {
              "speaker": "Raph",
              "text": "Domain expansion.",
              "portrait": "raph",
              "action": {
                "type": "domain_kill",
                "target": "rohito"
              }
            }
          ]
        }
      ],
      "pre": [
        {
          "speaker": "Oliver",
          "text": "You take it from here, Ada.",
          "portrait": "oliver",
          "action": {
            "type": "death",
            "key": "oliver"
          }
        },
        {
          "speaker": "Ada",
          "text": "OLIVER, NO!",
          "portrait": "ada"
        }
      ],
      "post": [
        {
          "speaker": "Ada",
          "text": "It’s over. Let’s find the cure.",
          "portrait": "ada"
        }
      ]
    },
    {
      "id": "lapeace",
      "title": "12. BARF SYMPTOMS / LA PEACE",
      "sub": "A domain that removes your movement",
      "rooms": [
        "forest_domain"
      ],
      "party": [
        "ada",
        "vessel",
        "raleigh",
        "raph"
      ],
      "waves": [
        {
          "enemies": [
            [
              "barf_domain",
              1
            ]
          ],
          "objective": "Survive the BARF SYMPTOMS Domain"
        },
        {
          "enemies": [
            [
              "rombie_raleigh",
              1
            ]
          ],
          "objective": "Stop Raleigh’s Rombie form"
        }
      ],
      "boss": "barf_domain",
      "qte": {
        "at": 0.65,
        "type": "barf"
      },
      "mid": [
        {
          "at": 0.38,
          "wave": 0,
          "lines": [
            {
              "speaker": "Ada",
              "text": "Do you guys feel that presence?",
              "portrait": "ada"
            },
            {
              "speaker": "Vessel",
              "text": "Yeah, I can’t move.",
              "portrait": "vessel"
            },
            {
              "speaker": "Jak Does Snacks",
              "text": "Jak… Does… Snacks…",
              "portrait": "jak_does_snacks"
            }
          ],
          "move": "JAK DOES SNACKS",
          "caster": "barf_domain"
        }
      ],
      "pre": [
        {
          "speaker": "BARF SYMPTOMS",
          "text": "Domain expansion.",
          "portrait": "barf_domain"
        },
        {
          "speaker": "Ada",
          "text": "Oh shiddings.",
          "portrait": "ada"
        },
        {
          "speaker": "BARF SYMPTOMS",
          "text": "You cannot attack. Click the BARTs to survive.",
          "portrait": "barf_domain"
        }
      ],
      "post": [
        {
          "speaker": "Raph",
          "text": "Did they just disintegrate?",
          "portrait": "raph"
        },
        {
          "speaker": "Ada",
          "text": "Somehow. We still have to find Nande.",
          "portrait": "ada"
        }
      ],
      "initialForms": {
        "ada": 2,
        "raph": 2
      },
      "waveLines": {
        "1": [
          {
            "speaker": "Ada",
            "text": "DIAMOND, DIAMOND, DIAMOND, DIAMOND.",
            "portrait": "ada"
          },
          {
            "speaker": "Ada",
            "text": "That’s La Peace… that’s La Peace.",
            "portrait": "ada"
          },
          {
            "speaker": "Raleigh",
            "text": "I’M ASCENDING!",
            "portrait": "raleigh",
            "action": {
              "type": "turn_rombie",
              "key": "raleigh"
            }
          }
        ]
      }
    },
    {
      "id": "flower",
      "title": "13. FLOWER CASTLE — DON’T DIE!",
      "sub": "Falling-serum cinematic battle",
      "rooms": [
        "flower_inside",
        "flower_outside"
      ],
      "party": [
        "shane",
        "seth",
        "flowery"
      ],
      "waves": [
        {
          "room": 0,
          "enemies": [
            [
              "giant_test_tube",
              1
            ]
          ],
          "objective": "Stop the giant test tube"
        },
        {
          "room": 1,
          "enemies": [
            [
              "normal_rombie",
              7
            ],
            [
              "flying_rombie",
              3
            ]
          ],
          "objective": "Protect Nyon and escape"
        },
        {
          "room": 1,
          "enemies": [
            [
              "rombie_mech",
              2
            ],
            [
              "normal_rombie",
              5
            ]
          ],
          "objective": "Survive the serum rain"
        }
      ],
      "boss": "giant_test_tube",
      "hazard": "serum",
      "pre": [
        {
          "speaker": "Shane",
          "text": "Come on seth, one more game!",
          "portrait": "shane"
        },
        {
          "speaker": "Seth",
          "text": "No shane, we don’t have time.",
          "portrait": "seth"
        },
        {
          "speaker": "Seth",
          "text": "Hey… what the hell is that in the sky?",
          "portrait": "seth"
        },
        {
          "speaker": "Shane",
          "text": "A game! The game is… don’t die!",
          "portrait": "shane"
        },
        {
          "speaker": "Jerona Man",
          "text": "Leaf it to me!",
          "portrait": "flowery"
        }
      ],
      "mid": [
        {
          "at": 0.68,
          "lines": [
            {
              "speaker": "Jerona Man",
              "text": "Take this!",
              "portrait": "flowery"
            },
            {
              "speaker": "Shane",
              "text": "ITs coming back… faster this time!",
              "portrait": "shane"
            }
          ],
          "move": "GIANT TEST TUBE"
        },
        {
          "at": 0.35,
          "lines": [
            {
              "speaker": "Jerona Man",
              "text": "You can’t beat a flowers… dreams!",
              "portrait": "flowery"
            }
          ],
          "move": "SERUM FALL"
        }
      ],
      "waveLines": {
        "1": [
          {
            "speaker": "Shane",
            "text": "JERONA MAN???",
            "portrait": "shane"
          },
          {
            "speaker": "Seth",
            "text": "Shane, do something!",
            "portrait": "seth"
          },
          {
            "speaker": "Shane",
            "text": "KAY!",
            "portrait": "shane"
          },
          {
            "speaker": "Shane",
            "text": "DONT BULLY THAT CUTE LITTLE KITTY, mew! TAKE THIS!",
            "portrait": "shane"
          }
        ],
        "2": [
          {
            "speaker": "Seth",
            "text": "Shane… i’ll be with you... i’m just napping.",
            "portrait": "seth"
          },
          {
            "speaker": "Shane",
            "text": "Okey!",
            "portrait": "shane"
          }
        ]
      },
      "post": [
        {
          "speaker": "Shane",
          "text": "Seth?",
          "portrait": "shane"
        },
        {
          "speaker": "Shane",
          "text": "SEEETH?",
          "portrait": "shane"
        },
        {
          "speaker": "Nande",
          "text": "Really?! We still have time to save them. Bring their bodies and follow me.",
          "portrait": "nande"
        }
      ]
    },
    {
      "id": "emerald",
      "title": "14. THE MASTER EMERALD WAR",
      "sub": "King Doodle & Max vs Metal Sonic",
      "rooms": [
        "emerald_arena",
        "emerald_power"
      ],
      "party": [
        "king_doodle",
        "max"
      ],
      "waves": [
        {
          "room": 0,
          "enemies": [
            [
              "metal_sonic",
              1
            ]
          ],
          "objective": "Protect the Master Emerald"
        }
      ],
      "boss": "metal_sonic",
      "bossEvolution": true,
      "mid": [
        {
          "at": 0.8,
          "lines": [
            {
              "speaker": "King Doodle",
              "text": "You will never get the master emerald metal sonic",
              "portrait": "king_doodle"
            },
            {
              "speaker": "Metal Sonic",
              "text": "You have 5 seconds to surrender",
              "portrait": "metal_sonic"
            },
            {
              "speaker": "King Doodle",
              "text": "Never.",
              "portrait": "king_doodle"
            }
          ],
          "move": "DOODLE ARMY"
        },
        {
          "at": 0.62,
          "lines": [
            {
              "speaker": "Metal Sonic",
              "text": "Pathetic.",
              "portrait": "metal_sonic"
            },
            {
              "speaker": "Max",
              "text": "Max we are fried",
              "portrait": "max"
            },
            {
              "speaker": "Metal Sonic",
              "text": "This is my true power.",
              "portrait": "super_neo_metal"
            }
          ],
          "move": "CHAOS SPEAR MAX",
          "room": 1,
          "evolve": "neo_metal"
        },
        {
          "at": 0.39,
          "lines": [
            {
              "speaker": "Max",
              "text": "MAX ATTACK!",
              "portrait": "max"
            },
            {
              "speaker": "Metal Sonic",
              "text": "I was using 10% of my power",
              "portrait": "neo_metal"
            },
            {
              "speaker": "Max",
              "text": "Nah, I’d evolve.",
              "portrait": "max",
              "action": {
                "type": "evolve",
                "key": "max",
                "form": 1
              }
            }
          ],
          "move": "MAX ATTACK",
          "evolve": "super_neo_metal"
        },
        {
          "at": 0.18,
          "lines": [
            {
              "speaker": "Metal Sonic",
              "text": "CHAOS BLAST.",
              "portrait": "super_neo_metal"
            },
            {
              "speaker": "King Doodle",
              "text": "I WILL KILL YOU FOREVER — SUPER GIGA BEAM!",
              "portrait": "king_doodle"
            }
          ],
          "move": "SUPER GIGA BEAM"
        }
      ],
      "pre": [
        {
          "speaker": "Metal Sonic",
          "text": "Yes finally i found the master emerald",
          "portrait": "metal_sonic"
        },
        {
          "speaker": "King Doodle",
          "text": "PROTECT THE MASTER EMERALD AT ALL COSTS!",
          "portrait": "king_doodle"
        },
        {
          "speaker": "Metal Sonic",
          "text": "Distract them. I will go to the emerald.",
          "portrait": "metal_sonic"
        }
      ],
      "post": [
        {
          "speaker": "Metal Sonic",
          "text": "WHAT DID YOU DO TO KING DOODLE?",
          "portrait": "super_neo_metal"
        },
        {
          "speaker": "Enemy",
          "text": "I absorbed him.",
          "portrait": "skeleton"
        },
        {
          "speaker": "Metal Sonic",
          "text": "CHAOS BLAST!",
          "portrait": "super_neo_metal"
        }
      ],
      "initialForms": {
        "max": 0
      }
    },
    {
      "id": "nande",
      "title": "15. SIEGE OF NANDE",
      "sub": "Retep attacks the cure base",
      "rooms": [
        "nande_base",
        "nande_temple"
      ],
      "party": [
        "nande",
        "ada",
        "raph"
      ],
      "waves": [
        {
          "room": 0,
          "enemies": [
            [
              "normal_rombie",
              5
            ],
            [
              "rombie_mech",
              1
            ]
          ],
          "objective": "Defend the entrance"
        },
        {
          "room": 0,
          "enemies": [
            [
              "retep",
              1
            ]
          ],
          "objective": "Stop Retep"
        },
        {
          "room": 1,
          "enemies": [
            [
              "retep",
              1
            ],
            [
              "normal_rombie",
              4
            ]
          ],
          "objective": "Final defense — protect Nande"
        }
      ],
      "boss": "retep",
      "waveAfterIntro": true,
      "qte": {
        "wave": 2,
        "type": "jak"
      },
      "pre": [
        {
          "speaker": "Nande",
          "text": "What are your guy’s intentions?",
          "portrait": "nande"
        },
        {
          "speaker": "Ada",
          "text": "We want to end this Rombie virus and defeat Metal Sonic and his villain allies.",
          "portrait": "ada"
        },
        {
          "speaker": "Nande",
          "text": "I see.",
          "portrait": "nande"
        },
        {
          "speaker": "Ada",
          "text": "Uh guys… what is that outside?",
          "portrait": "ada"
        },
        {
          "speaker": "Raph",
          "text": "Oh crap its retep",
          "portrait": "raph"
        },
        {
          "speaker": "Retep",
          "text": "Give me the cure.",
          "portrait": "retep"
        },
        {
          "speaker": "Raph",
          "text": "Kick rock’s, we don’t have it yet.",
          "portrait": "raph"
        }
      ],
      "waveLines": {
        "2": [
          {
            "speaker": "Ada",
            "text": "CHERRY BLAST!",
            "portrait": "ada"
          },
          {
            "speaker": "Raph",
            "text": "ORA!",
            "portrait": "raph"
          },
          {
            "speaker": "Retep",
            "text": "Phonk Blast.",
            "portrait": "retep"
          },
          {
            "speaker": "Retep",
            "text": "Did someone say… STAR PINGA?",
            "portrait": "retep"
          }
        ]
      },
      "mid": [
        {
          "at": 0.57,
          "lines": [
            {
              "speaker": "Retep",
              "text": "ZAPATO.",
              "portrait": "retep"
            },
            {
              "speaker": "Retep",
              "text": "MADU MADU MADU MADU!",
              "portrait": "retep"
            }
          ],
          "move": "ZAPATO"
        },
        {
          "at": 0.29,
          "lines": [
            {
              "speaker": "Retep",
              "text": "POLYESTER.",
              "portrait": "retep"
            },
            {
              "speaker": "Ada",
              "text": "Guys, he’s almost here.",
              "portrait": "ada"
            }
          ],
          "move": "POLYESTER"
        }
      ],
      "post": [
        {
          "speaker": "Nande",
          "text": "Kars is here. I will handle him.",
          "portrait": "nande"
        }
      ],
      "initialForms": {
        "ada": 3,
        "raph": 2
      }
    },
    {
      "id": "nande_kars",
      "title": "16. NANDE VS KARS",
      "sub": "Jak Does Snacks",
      "rooms": [
        "nande_temple"
      ],
      "party": [
        "nande"
      ],
      "boss": "kars",
      "waves": [
        {
          "enemies": [
            [
              "kars",
              1
            ]
          ],
          "objective": "Defeat Kars and protect the cure"
        }
      ],
      "pre": [
        {
          "speaker": "Kars",
          "text": "I will make you pay for what you did to me.",
          "portrait": "kars"
        },
        {
          "speaker": "Nande",
          "text": "So be it.",
          "portrait": "nande"
        }
      ],
      "mid": [
        {
          "at": 0.5,
          "lines": [
            {
              "speaker": "Nande",
              "text": "JAK DOES SNACKS!",
              "portrait": "nande"
            }
          ],
          "move": "JAK DOES SNACKS",
          "caster": "nande"
        }
      ],
      "post": [
        {
          "speaker": "Nande",
          "text": "I guess he couldn’t handle it.",
          "portrait": "nande"
        },
        {
          "speaker": "Retep",
          "text": "You fight them off. I will start the Culling Games.",
          "portrait": "retep"
        },
        {
          "speaker": "Ada",
          "text": "Why is this barrier here?",
          "portrait": "ada"
        },
        {
          "speaker": "Raph",
          "text": "It’s for the Culling Games.",
          "portrait": "raph"
        },
        {
          "speaker": "Ada",
          "text": "We split up to end the Culling Games.",
          "portrait": "ada"
        }
      ]
    },
    {
      "id": "culling1",
      "title": "17. CULLING GAMES — ADA & RAPH",
      "sub": "Rombie Carrier / the execution squad",
      "rooms": [
        "culling_corridor"
      ],
      "party": [
        "ada",
        "raph",
        "leonard"
      ],
      "waves": [
        {
          "enemies": [
            [
              "rombie_carrier",
              1
            ]
          ],
          "objective": "Defeat the Rombie Carrier"
        },
        {
          "enemies": [
            [
              "super_monkey_fan",
              1
            ],
            [
              "vaughn",
              1
            ]
          ],
          "objective": "Survive the execution squad"
        }
      ],
      "boss": "super_monkey_fan",
      "pre": [
        {
          "speaker": "Ada",
          "text": "Dang, that’s one big Rombie.",
          "portrait": "ada"
        },
        {
          "speaker": "Raph",
          "text": "STAR PLATINUM.",
          "portrait": "raph"
        }
      ],
      "waveLines": {
        "1": [
          {
            "speaker": "Ada",
            "text": "wtf are you bro",
            "portrait": "ada"
          },
          {
            "speaker": "Super Monkey Fan Club",
            "text": "I’m here to execute you and Leonard.",
            "portrait": "super_monkey_fan"
          },
          {
            "speaker": "Vaughn",
            "text": "And the Canadian government sent me here to kill you, Ada.",
            "portrait": "vaughn"
          }
        ]
      },
      "mid": [
        {
          "at": 0.6,
          "wave": 1,
          "lines": [
            {
              "speaker": "Vaughn",
              "text": "HULK POLYESTER.",
              "portrait": "vaughn"
            }
          ],
          "move": "HULK POLYESTER",
          "caster": "vaughn"
        },
        {
          "at": 0.3,
          "wave": 1,
          "lines": [
            {
              "speaker": "Vaughn",
              "text": "ACID MAPLE SYRUP!",
              "portrait": "vaughn"
            }
          ],
          "move": "ACID MAPLE SYRUP",
          "caster": "vaughn"
        }
      ],
      "post": [
        {
          "speaker": "Super Monkey Fan Club",
          "text": "You’re coming with me!",
          "portrait": "super_monkey_fan",
          "action": {
            "type": "kidnap",
            "key": "raph"
          }
        },
        {
          "speaker": "Ada",
          "text": "RAPH!",
          "portrait": "ada"
        },
        {
          "speaker": "Vaughn",
          "text": "I’m actually a good guy. I promised Mighty Eagle I’d find you.",
          "portrait": "vaughn",
          "action": {
            "type": "join",
            "key": "vaughn"
          }
        },
        {
          "speaker": "Myles",
          "text": "And my name is Myles.",
          "portrait": "myles",
          "action": {
            "type": "join",
            "key": "myles"
          }
        }
      ],
      "initialForms": {
        "ada": 3,
        "raph": 2
      }
    },
    {
      "id": "dave",
      "title": "18. PROFESSOR DAVE’S DOMAIN",
      "sub": "Raleigh vs the explanation",
      "rooms": [
        "prof_subway"
      ],
      "party": [
        "raleigh"
      ],
      "waves": [
        {
          "enemies": [
            [
              "professor_dave",
              1
            ]
          ],
          "objective": "Stay awake and win"
        }
      ],
      "boss": "professor_dave",
      "qte": {
        "at": 0.72,
        "type": "lecture"
      },
      "pre": [
        {
          "speaker": "Raleigh",
          "text": "I need to find some esay points.",
          "portrait": "raleigh"
        },
        {
          "speaker": "Raleigh",
          "text": "Who tf are you?",
          "portrait": "raleigh"
        },
        {
          "speaker": "Professor Dave",
          "text": "PROFESSOR DAVE",
          "portrait": "professor_dave"
        },
        {
          "speaker": "Professor Dave",
          "text": "DOMAIN EXPANSION.",
          "portrait": "professor_dave"
        }
      ],
      "mid": [
        {
          "at": 0.42,
          "lines": [
            {
              "speaker": "Professor Dave",
              "text": "Anything anyone says becomes a topic I have to explain. The guaranteed hit is you go to sleep.",
              "portrait": "professor_dave"
            },
            {
              "speaker": "Raleigh",
              "text": "Then explain why Trump is doing random stuff.",
              "portrait": "raleigh"
            },
            {
              "speaker": "Professor Dave",
              "text": "Umm… idk.",
              "portrait": "professor_dave"
            }
          ],
          "move": "PECK ATTACK"
        }
      ],
      "post": [
        {
          "speaker": "Raleigh",
          "text": "Quickest 67 points ever.",
          "portrait": "raleigh"
        },
        {
          "speaker": "Voice",
          "text": "Dumb ahh, it’s only 5.",
          "portrait": "professor_dave"
        }
      ],
      "raleighRombie": true
    },
    {
      "id": "aqua",
      "title": "19. AQUA MECH VS SPAMTON NEO",
      "sub": "Make-a-mech machine battle",
      "rooms": [
        "aqua_machine"
      ],
      "party": [
        "aqua_mech"
      ],
      "waves": [
        {
          "enemies": [
            [
              "spamton_neo",
              1
            ]
          ],
          "objective": "Beat Spamton NEO"
        }
      ],
      "boss": "spamton_neo",
      "pre": [
        {
          "speaker": "Shane",
          "text": "The make-a-mech machine… I have an idea!",
          "portrait": "shane"
        },
        {
          "speaker": "Shane",
          "text": "OH MY GOD :O",
          "portrait": "shane"
        },
        {
          "speaker": "Spamton NEO",
          "text": "And just where do you think you’re going, [little spong??]",
          "portrait": "spamton_neo"
        }
      ],
      "mid": [
        {
          "at": 0.72,
          "lines": [
            {
              "speaker": "Spamton NEO",
              "text": "GET OVER [to my location!]",
              "portrait": "spamton_neo"
            },
            {
              "speaker": "Aqua Mech 1.0",
              "text": "OMEGA ATTACK! GO!!!",
              "portrait": "aqua_mech"
            }
          ],
          "move": "OMEGA ATTACK"
        },
        {
          "at": 0.42,
          "lines": [
            {
              "speaker": "Spamton NEO",
              "text": "[pipis] GO GO GO!",
              "portrait": "spamton_neo"
            },
            {
              "speaker": "Spamton NEO",
              "text": "That’s the power of [pipis] for you!",
              "portrait": "spamton_neo"
            }
          ],
          "move": "PIPIS"
        }
      ],
      "post": [
        {
          "speaker": "Aqua Mech 1.0",
          "text": "BYE BUDDY!",
          "portrait": "aqua_mech"
        },
        {
          "speaker": "Shane",
          "text": "That was close.",
          "portrait": "shane"
        }
      ]
    },
    {
      "id": "fanclub",
      "title": "20. END THE SUPER MONKEY FAN CLUB",
      "sub": "Oliver’s heavenly light novel form",
      "rooms": [
        "monkey_ruins"
      ],
      "party": [
        "oliver_hvnly"
      ],
      "waves": [
        {
          "enemies": [
            [
              "super_monkey_fan",
              1
            ]
          ],
          "objective": "Defeat the Super Monkey Fan Club"
        }
      ],
      "boss": "super_monkey_fan",
      "pre": [
        {
          "speaker": "Oliver (HVNLY)",
          "text": "I’m gonna end the Super Monkey Fan Club.",
          "portrait": "oliver_hvnly"
        },
        {
          "speaker": "Super Monkey Fan Club",
          "text": "How cruel.",
          "portrait": "super_monkey_fan"
        },
        {
          "speaker": "Super Monkey Fan Club",
          "text": "Don’t you have a human heart?",
          "portrait": "super_monkey_fan"
        }
      ],
      "waveLines": {},
      "mid": [
        {
          "at": 0.65,
          "lines": [
            {
              "speaker": "Oliver (HVNLY)",
              "text": "This is my heavenly light novel form.",
              "portrait": "oliver_hvnly"
            }
          ],
          "move": "HEAVENLY LIGHT NOVEL",
          "caster": "oliver_hvnly"
        },
        {
          "at": 0.4,
          "lines": [
            {
              "speaker": "Super Monkey Fan Club",
              "text": "NO TACO SAUCE!",
              "portrait": "super_monkey_fan"
            }
          ],
          "move": "HEAVENLY FIRE BIRD",
          "caster": "oliver_hvnly"
        }
      ],
      "post": [
        {
          "speaker": "Super Monkey Fan Club",
          "text": "YOU FRAU-",
          "portrait": "super_monkey_fan",
          "action": {
            "type": "source_slide",
            "key": "slide802"
          }
        },
        {
          "speaker": "Oliver (HVNLY)",
          "text": "24 darts per second, right?",
          "portrait": "oliver_hvnly"
        }
      ]
    },
    {
      "id": "chimera",
      "title": "21. CHIMERA BLUE LINE GARDEN",
      "sub": "Myles and Max vs Reggie Star and Hazenoki",
      "rooms": [
        "chimera_city"
      ],
      "party": [
        "myles",
        "ada"
      ],
      "waves": [
        {
          "enemies": [
            [
              "blue_line_enemy",
              1
            ],
            [
              "hazanoki",
              1
            ]
          ],
          "objective": "Defeat Reggie Star and Hazenoki"
        }
      ],
      "boss": "blue_line_enemy",
      "qte": {
        "at": 0.6,
        "type": "chimera"
      },
      "pre": [
        {
          "speaker": "Myles",
          "text": "Let’s split up for no absolute reason.",
          "portrait": "myles"
        },
        {
          "speaker": "Ada",
          "text": "Agreed.",
          "portrait": "ada",
          "action": {
            "type": "leave",
            "key": "ada"
          }
        },
        {
          "speaker": "Max",
          "text": "Do not worry specimen, for I have a joke. Don’t marry me because I DON’T WANT YOU AS MY WIFI!",
          "portrait": "max",
          "action": {
            "type": "join",
            "key": "max"
          }
        },
        {
          "speaker": "Reggie Star",
          "text": "That joke was horrid.",
          "portrait": "registar"
        }
      ],
      "mid": [
        {
          "at": 0.7,
          "lines": [
            {
              "speaker": "Myles",
              "text": "DOMAIN TENKAI.",
              "portrait": "myles"
            },
            {
              "speaker": "Myles",
              "text": "CHIMERA BLUE LINE GARDEN.",
              "portrait": "myles"
            },
            {
              "speaker": "Reggie Star",
              "text": "Oh crap.",
              "portrait": "registar"
            }
          ],
          "move": "CHIMERA BLUE LINE GARDEN",
          "caster": "myles"
        },
        {
          "at": 0.34,
          "lines": [
            {
              "speaker": "Myles",
              "text": "Now I will summon… THE LOUISIANA PURCHASE!!!",
              "portrait": "myles"
            },
            {
              "speaker": "Reggie Star",
              "text": "We ain’t in Japan.",
              "portrait": "registar"
            },
            {
              "speaker": "Myles",
              "text": "Oh mb gang.",
              "portrait": "myles"
            }
          ],
          "move": "LOUISIANA PURCHASE",
          "caster": "myles"
        }
      ],
      "post": [
        {
          "speaker": "Myles",
          "text": "Blue line attack GO!",
          "portrait": "myles"
        },
        {
          "speaker": "Myles",
          "text": "ez •ᴗ•",
          "portrait": "myles"
        }
      ],
      "initialForms": {
        "ada": 3,
        "max": 0
      }
    },
    {
      "id": "saul",
      "title": "22. BETTER CALL HIM — COURTROOM DOMAIN",
      "sub": "Ada vs Saul",
      "rooms": [
        "courtroom"
      ],
      "party": [
        "ada"
      ],
      "waves": [
        {
          "enemies": [
            [
              "saul",
              1
            ]
          ],
          "objective": "Survive the trial and the execution phase"
        }
      ],
      "boss": "saul",
      "qte": {
        "at": 0.74,
        "type": "courtroom"
      },
      "pre": [
        {
          "speaker": "Ada",
          "text": "Who are you?",
          "portrait": "ada"
        },
        {
          "speaker": "Ada",
          "text": "No more questions time to fight saul",
          "portrait": "ada"
        },
        {
          "speaker": "Saul",
          "text": "DID YOU CALL ME?!",
          "portrait": "saul"
        },
        {
          "speaker": "Saul",
          "text": "DOMAIN TENKAI.",
          "portrait": "saul"
        }
      ],
      "mid": [
        {
          "at": 0.45,
          "lines": [
            {
              "speaker": "Ada",
              "text": "RETRIAL.",
              "portrait": "ada"
            },
            {
              "speaker": "Saul",
              "text": "bruh",
              "portrait": "saul"
            }
          ],
          "move": "RETRIAL",
          "caster": "ada"
        },
        {
          "at": 0.18,
          "lines": [
            {
              "speaker": "Saul",
              "text": "OK NOW YOUR GOING TO PERISH",
              "portrait": "saul"
            },
            {
              "speaker": "Ada",
              "text": "*You’re",
              "portrait": "ada"
            },
            {
              "speaker": "Saul",
              "text": "Wtf does that mean???",
              "portrait": "saul"
            }
          ],
          "move": "PUBLIC EXECUTION"
        }
      ],
      "post": [
        {
          "speaker": "Saul",
          "text": "You know what i think your pure of heart and i will join your team",
          "portrait": "saul"
        },
        {
          "speaker": "Ada",
          "text": "That was corny as sheet",
          "portrait": "ada"
        }
      ],
      "initialForms": {
        "ada": 3
      }
    },
    {
      "id": "sendai",
      "title": "23. SENDAI COLONY — THREE-WAY DOMAIN CLASH",
      "sub": "Chapter 1 finale",
      "rooms": [
        "sendai",
        "sendai_clash"
      ],
      "party": [
        "vaughn",
        "ada",
        "raph",
        "myles"
      ],
      "waves": [
        {
          "enemies": [
            [
              "ryu",
              1
            ],
            [
              "uro",
              1
            ]
          ],
          "objective": "Reach the domain clash"
        },
        {
          "enemies": [
            [
              "ryu",
              1
            ],
            [
              "hazanoki",
              1
            ],
            [
              "kurocust",
              1
            ]
          ],
          "objective": "Break the three-way domain clash",
          "room": 1
        },
        {
          "enemies": [
            [
              "ryu",
              1
            ]
          ],
          "objective": "Finish the Sendai colony battle",
          "room": 0
        }
      ],
      "boss": "ryu",
      "qte": {
        "wave": 1,
        "type": "clash"
      },
      "pre": [
        {
          "speaker": "Voice",
          "text": "Now to Sendai Colony.",
          "portrait": "sendai_enemy"
        },
        {
          "speaker": "Fighter",
          "text": "There’s gonna be a 3 way domain clash.",
          "portrait": "sendai_enemy"
        },
        {
          "speaker": "Vaughn",
          "text": "But I don’t have one.",
          "portrait": "vaughn"
        },
        {
          "speaker": "Fighter",
          "text": "When we “domain clash”, I need you to come in and break it.",
          "portrait": "sendai_enemy"
        },
        {
          "speaker": "Vaughn",
          "text": "Alright.",
          "portrait": "vaughn"
        }
      ],
      "waveLines": {
        "1": [
          {
            "speaker": "Vaughn",
            "text": "Let’s team on this floid rq.",
            "portrait": "vaughn"
          },
          {
            "speaker": "Enemy",
            "text": "You weren’t invited.",
            "portrait": "sendai_enemy"
          }
        ],
        "2": [
          {
            "speaker": "Vaughn",
            "text": "Alr bro lets just fight without talking",
            "portrait": "vaughn"
          },
          {
            "speaker": "Vaughn",
            "text": "Because at this point… WORDS ARE MEANINGLESS",
            "portrait": "vaughn"
          },
          {
            "speaker": "Fighter",
            "text": "KUROCUST GUY HELP! DOMAIN TENKAI! DOMAIN TENKAI!",
            "portrait": "sendai_enemy"
          },
          {
            "speaker": "Kurocust Guy",
            "text": "Yo whats up i broke it",
            "portrait": "kurocust"
          }
        ]
      },
      "mid": [
        {
          "at": 0.36,
          "lines": [
            {
              "speaker": "Enemy",
              "text": "YOU IMPUDENT WRETCH.",
              "portrait": "sendai_enemy"
            },
            {
              "speaker": "Vaughn",
              "text": "Let’s larp.",
              "portrait": "vaughn"
            }
          ],
          "move": "DOMAIN CLASH"
        }
      ],
      "post": [
        {
          "speaker": "Vaughn",
          "text": "Omg finally some quality",
          "portrait": "vaughn"
        },
        {
          "speaker": "Vaughn",
          "text": "Whoops i burned him",
          "portrait": "vaughn"
        },
        {
          "speaker": "Voice",
          "text": "I’ll take him. He might be useful later.",
          "portrait": "sendai_enemy"
        },
        {
          "speaker": "Voice",
          "text": "This marks the end of the animated Rombies.",
          "portrait": "sendai_enemy"
        }
      ],
      "initialForms": {
        "ada": 3,
        "raph": 2
      }
    }
  ],
  "SCENES": {
    "lab": {
      "title": "The experiment",
      "room": "lab",
      "party": [
        "metal_sonic"
      ],
      "steps": [
        {
          "label": "Inspect the capsule",
          "speaker": "Scientist",
          "text": "In this capsule there was an experiment…"
        },
        {
          "label": "Break the capsule",
          "speaker": "Metal Sonic",
          "text": "NOE!",
          "action": {
            "type": "breakout"
          }
        }
      ],
      "sourceSlides": [
        2,
        3,
        4
      ],
      "forms": {}
    },
    "desert": {
      "title": "The serum reaches Miami",
      "room": "beach",
      "party": [
        "raleigh",
        "raph"
      ],
      "steps": [
        {
          "label": "Look at the sky",
          "speaker": "Raleigh",
          "text": "What is that in the sky?"
        },
        {
          "label": "Reach the car",
          "speaker": "Raph",
          "text": "RUN! Get in!"
        },
        {
          "label": "Escape the shoreline",
          "speaker": "Raleigh",
          "text": "I think we’re cooked."
        }
      ],
      "sourceSlides": [
        20,
        21,
        23,
        24,
        31
      ],
      "forms": {}
    },
    "backrooms": {
      "title": "The private island",
      "room": "island",
      "party": [
        "raleigh",
        "raph",
        "ada"
      ],
      "steps": [
        {
          "label": "Land on the island",
          "speaker": "Raleigh",
          "text": "Look, an island!"
        },
        {
          "label": "Investigate the stranger",
          "speaker": "Metal Sonic",
          "text": "And as for you… you will go to the Backrooms."
        },
        {
          "label": "Enter the portal",
          "speaker": "Ada",
          "text": "Some robot hedgehog just sent me here.",
          "action": {
            "type": "portal"
          }
        }
      ],
      "sourceSlides": [
        39,
        43,
        45,
        49
      ],
      "forms": {}
    },
    "sukuna": {
      "title": "A portal to the ocean",
      "room": "boat_shore",
      "party": [
        "ada",
        "vivi",
        "leonard"
      ],
      "steps": [
        {
          "label": "Meet Vivi",
          "speaker": "Vivi",
          "text": "I’m Vivi, most known as Ratafak. I’m her vessel, and my husband is Choso."
        },
        {
          "label": "Find Choso",
          "speaker": "Choso",
          "text": "Let’s go to the surface. The Rombie serum is coming."
        },
        {
          "label": "Board the boat",
          "speaker": "Ada",
          "text": "It looks better on the inside."
        }
      ],
      "sourceSlides": [
        66,
        69,
        79,
        80
      ],
      "forms": {}
    },
    "overtime": {
      "title": "A cure for the virus",
      "room": "city",
      "party": [
        "oliver",
        "leonard"
      ],
      "steps": [
        {
          "label": "Search the street",
          "speaker": "Oliver",
          "text": "There are robotic zombies around here. I’ve been experimenting on them to find a cure."
        },
        {
          "label": "Recruit Oliver",
          "speaker": "Leonard",
          "text": "Do you want to join us?"
        },
        {
          "label": "Follow the alarm",
          "speaker": "Oliver",
          "text": "Sure. Let’s go."
        }
      ],
      "sourceSlides": [
        125,
        128,
        129,
        130
      ],
      "forms": {}
    },
    "eagle_rescue": {
      "title": "The journey to Shibuya",
      "room": "shibuya",
      "party": [
        "mighty_eagle"
      ],
      "steps": [
        {
          "label": "Find the station",
          "speaker": "Rohito",
          "text": "I beat Michael."
        },
        {
          "label": "Face the pursuers",
          "speaker": "Mighty Eagle",
          "text": "So you actually showed up. You guys are going down."
        }
      ],
      "sourceSlides": [
        153,
        154,
        156
      ],
      "forms": {}
    },
    "station": {
      "title": "Split up at the station",
      "room": "shibuya",
      "party": [
        "ada",
        "raph",
        "rapper_po"
      ],
      "steps": [
        {
          "label": "Check the entrance",
          "speaker": "Ada",
          "text": "There’s a Grasshopper Rombie in this station."
        },
        {
          "label": "Send Raph ahead",
          "speaker": "Ada",
          "text": "Raph, you go. I’ll deal with this thing."
        },
        {
          "label": "Find Rapper Po",
          "speaker": "Rapper Po",
          "text": "Noodles are ready."
        }
      ],
      "sourceSlides": [
        169,
        171,
        172,
        208
      ],
      "forms": {
        "raph": 1
      }
    },
    "ragon_rogo": {
      "title": "Find the others",
      "room": "shibuya",
      "party": [
        "oliver",
        "rapper_po",
        "vivi",
        "raph"
      ],
      "steps": [
        {
          "label": "Follow the noise",
          "speaker": "Oliver",
          "text": "I need to find the others."
        },
        {
          "label": "Heal with noodles",
          "speaker": "Rapper Po",
          "text": "Let me heal with my noodles rq.",
          "action": {
            "type": "heal_party"
          }
        },
        {
          "label": "Regroup",
          "speaker": "Raph",
          "text": "Let’s get to the others."
        }
      ],
      "sourceSlides": [
        188,
        189,
        208,
        209,
        210
      ],
      "forms": {
        "raph": 1
      }
    },
    "iviv_rogo": {
      "title": "Iviv takes control",
      "room": "shibuya",
      "party": [
        "iviv"
      ],
      "steps": [
        {
          "label": "Protect the vessel",
          "speaker": "Iviv",
          "text": "How dare you try to kill my vessel!"
        },
        {
          "label": "Confront Rogo",
          "speaker": "Rogo",
          "text": "Man, I want to go to Malaysia."
        }
      ],
      "sourceSlides": [
        234,
        235
      ],
      "forms": {}
    },
    "polyester_edit": {
      "title": "The armored edit",
      "room": "polyester_city",
      "party": [
        "iviv",
        "kyrara"
      ],
      "steps": [
        {
          "label": "Find Kyrara",
          "speaker": "Iviv",
          "text": "Oh, sup Kyrara."
        },
        {
          "label": "Approach Leonard",
          "speaker": "Kyrara",
          "text": "Who is this?"
        }
      ],
      "sourceSlides": [
        287,
        288,
        289
      ],
      "forms": {}
    },
    "rohito": {
      "title": "Below the station",
      "room": "shibuya",
      "party": [
        "ada",
        "todo"
      ],
      "steps": [
        {
          "label": "Follow the trail",
          "speaker": "Ada",
          "text": "There should be a patchface Rombie below."
        },
        {
          "label": "Find Oliver",
          "speaker": "Oliver",
          "text": "Ada… you take it from here."
        }
      ],
      "sourceSlides": [
        171,
        242,
        244
      ],
      "forms": {}
    },
    "lapeace": {
      "title": "The search for Nande",
      "room": "ice_fields",
      "party": [
        "ada",
        "vessel",
        "raleigh",
        "raph"
      ],
      "steps": [
        {
          "label": "Break the ice",
          "speaker": "Ada",
          "text": "How are we getting out of here?"
        },
        {
          "label": "Follow La Peace",
          "speaker": "Vessel",
          "text": "We are trying to locate Nande. Apparently he has the cure."
        },
        {
          "label": "Meet Raph",
          "speaker": "Raph",
          "text": "I evolved while we were apart. Let’s find Nande.",
          "action": {
            "type": "evolve",
            "key": "raph",
            "form": 2
          }
        }
      ],
      "sourceSlides": [
        328,
        330,
        331,
        337,
        339,
        340
      ],
      "forms": {
        "ada": 2,
        "raph": 2
      }
    },
    "flower": {
      "title": "Flower Castle",
      "room": "flower_inside",
      "party": [
        "shane",
        "seth",
        "flowery"
      ],
      "steps": [
        {
          "label": "Find Seth",
          "speaker": "Shane",
          "text": "Come on Seth, one more game!"
        },
        {
          "label": "Inspect the sky",
          "speaker": "Seth",
          "text": "No Shane, we don’t have time. What is that in the sky?"
        },
        {
          "label": "Warn Jerona Man",
          "speaker": "Shane",
          "text": "A game! The game is… don’t die!"
        }
      ],
      "sourceSlides": [
        420,
        421,
        422,
        424
      ],
      "forms": {}
    },
    "emerald": {
      "title": "Protect the Master Emerald",
      "room": "emerald_island",
      "party": [
        "max",
        "king_doodle"
      ],
      "steps": [
        {
          "label": "Rally the doodles",
          "speaker": "King Doodle",
          "text": "Protect the Master Emerald at all costs!"
        },
        {
          "label": "Guard the emerald",
          "speaker": "Max",
          "text": "Metal Sonic is coming."
        },
        {
          "label": "Confront Metal Sonic",
          "speaker": "Metal Sonic",
          "text": "Finally, I found the Master Emerald."
        }
      ],
      "sourceSlides": [
        491,
        492,
        497
      ],
      "forms": {}
    },
    "nande": {
      "title": "The cure base",
      "room": "cure_island",
      "party": [
        "ada",
        "raph",
        "nande"
      ],
      "steps": [
        {
          "label": "Reach the island",
          "speaker": "Ada",
          "text": "We heard Nande has the cure."
        },
        {
          "label": "Bring Oliver’s remains",
          "speaker": "Raph",
          "text": "Can you also revive Oliver?"
        },
        {
          "label": "Speak to Nande",
          "speaker": "Nande",
          "text": "I’ll see what I can do. Ada, your new form will help us defend this place.",
          "action": {
            "type": "evolve",
            "key": "ada",
            "form": 3
          }
        }
      ],
      "sourceSlides": [
        580,
        582,
        584,
        589,
        590
      ],
      "forms": {
        "ada": 2,
        "raph": 2
      }
    },
    "nande_kars": {
      "title": "An old enemy returns",
      "room": "nande_temple",
      "party": [
        "nande"
      ],
      "steps": [
        {
          "label": "Remember the battle",
          "speaker": "Nande",
          "text": "I was fighting a vampire who conquered the sun. Then I sent him to space."
        },
        {
          "label": "Face Kars",
          "speaker": "Kars",
          "text": "Is Nande here? If so, he’s dead."
        },
        {
          "label": "Call the stand",
          "speaker": "Nande",
          "text": "Jak… Does… Snacks…"
        }
      ],
      "sourceSlides": [
        628,
        629,
        630,
        640,
        655,
        661
      ],
      "forms": {}
    },
    "culling1": {
      "title": "The Culling Games begin",
      "room": "culling_corridor",
      "party": [
        "ada",
        "raph",
        "leonard"
      ],
      "steps": [
        {
          "label": "Inspect the barrier",
          "speaker": "Raph",
          "text": "It’s for the Culling Games."
        },
        {
          "label": "Plan the split",
          "speaker": "Ada",
          "text": "All of us split up to end the Culling Games."
        },
        {
          "label": "Enter the colony",
          "speaker": "Raph",
          "text": "Alright."
        }
      ],
      "sourceSlides": [
        687,
        688,
        689,
        701
      ],
      "forms": {
        "ada": 3,
        "raph": 2
      }
    },
    "dave": {
      "title": "Raleigh looks for points",
      "room": "prof_subway",
      "party": [
        "raleigh"
      ],
      "steps": [
        {
          "label": "Search the subway",
          "speaker": "Raleigh",
          "text": "I need to find some esay points."
        },
        {
          "label": "Find the lecturer",
          "speaker": "Professor Dave",
          "text": "PROFESSOR DAVE!"
        }
      ],
      "sourceSlides": [
        743,
        744,
        745
      ],
      "forms": {}
    },
    "aqua": {
      "title": "The make-a-mech machine",
      "room": "aqua_machine",
      "party": [
        "shane"
      ],
      "steps": [
        {
          "label": "Inspect the keyboard",
          "speaker": "Shane",
          "text": "The make-a-mech machine… I have an idea!"
        },
        {
          "label": "Build Aqua",
          "speaker": "Shane",
          "text": "OH MY GOD :O",
          "action": {
            "type": "build_mech"
          }
        },
        {
          "label": "Board the mech",
          "speaker": "Shane",
          "text": "Here I go!"
        }
      ],
      "sourceSlides": [
        752,
        753,
        754,
        755,
        756,
        758
      ],
      "forms": {}
    },
    "fanclub": {
      "title": "Oliver returns",
      "room": "monkey_ruins",
      "party": [
        "oliver_hvnly"
      ],
      "steps": [
        {
          "label": "Recover Oliver",
          "speaker": "Oliver (HVNLY)",
          "text": "Nande’s treatment worked. I’m back."
        },
        {
          "label": "Reveal the heavenly form",
          "speaker": "Oliver (HVNLY)",
          "text": "This is my heavenly light novel form.",
          "action": {
            "type": "aura"
          }
        },
        {
          "label": "Track the fan club",
          "speaker": "Oliver (HVNLY)",
          "text": "I’m gonna end the Super Monkey Fan Club."
        }
      ],
      "sourceSlides": [
        589,
        627,
        771,
        773,
        783
      ],
      "forms": {}
    },
    "chimera": {
      "title": "Myles and Ada split up",
      "room": "city",
      "party": [
        "myles",
        "ada"
      ],
      "steps": [
        {
          "label": "Meet Myles",
          "speaker": "Myles",
          "text": "And my name is Myles."
        },
        {
          "label": "Reach the junction",
          "speaker": "Myles",
          "text": "Let’s split up for no absolute reason."
        }
      ],
      "sourceSlides": [
        741,
        812,
        813
      ],
      "forms": {
        "ada": 3
      }
    },
    "saul": {
      "title": "Better call him",
      "room": "city",
      "party": [
        "ada"
      ],
      "steps": [
        {
          "label": "Follow the summons",
          "speaker": "Ada",
          "text": "Who are you?"
        },
        {
          "label": "Enter the courtroom",
          "speaker": "Saul",
          "text": "DID YOU CALL ME?!"
        }
      ],
      "sourceSlides": [
        842,
        845,
        847
      ],
      "forms": {
        "ada": 3
      }
    },
    "sendai": {
      "title": "Sendai Colony",
      "room": "sendai",
      "party": [
        "vaughn",
        "ada",
        "raph",
        "myles"
      ],
      "steps": [
        {
          "label": "Reach the colony",
          "speaker": "Ryu Fushiguro",
          "text": "There’s going to be a three-way domain clash."
        },
        {
          "label": "Hear the plan",
          "speaker": "Vaughn",
          "text": "But I don’t have one."
        },
        {
          "label": "Prepare to break it",
          "speaker": "Ryu Fushiguro",
          "text": "When we domain clash, I need you to come in and break it."
        }
      ],
      "sourceSlides": [
        873,
        887,
        889,
        890,
        891,
        892
      ],
      "forms": {
        "ada": 3,
        "raph": 2
      }
    }
  },
  "LEGACY_ORDER": [
    "lab",
    "desert",
    "sukuna",
    "overtime",
    "eagle_rescue",
    "station",
    "ragon_rogo",
    "iviv_rogo",
    "polyester_edit",
    "backrooms",
    "rohito",
    "lapeace",
    "flower",
    "emerald",
    "nande",
    "culling1",
    "dave",
    "aqua",
    "fanclub",
    "chimera",
    "saul",
    "sendai"
  ]
};

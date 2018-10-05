
Walkthrough on schema formating for novices (like me)

## What is an "Item"
For the purposes of the site an item falls within the following:
 * Adventure Gear
 * Ammunition
 * Astisan Tool
 * Eldritch Machine
 * Explosive
 * Firearm
 * Futureist
 * Gaming Set
 * Generic Variant
 * Heavy Armor
 * Instrument
 * Light Armor
 * Martial Weapon
 * * battleaxe; greataxe; greatsword; longbow; longsword; mace; maul; scimitar; shortsword; trident; war pick; warhammer
 * Medium Armor
 * Melee Weapon
 * Modern
 * Mount
 * Other
 * Poison
 * Potion
 * Ranged Weapon
 * Renaissance
 * Ring
 * Rod
 * Ring
 * Rod
 * Scroll
 * Shield
 * Simple Weapon
 * * Club; Dagger; Dart; Javelin; Mace; Quarterstaff; Spear
 * Spellcasting Focus
 * Staff
 * Tack and Harness
 * Tool
 * Trade Good
 * Treasure
 * Vehicle
 * Wand
 * Wondrous Item

## Field Definitions

 "name": "<string>"
	The name field should be a unique text lable for the item.

 "type": "<field>"
	Types can be of the one of the [[types]]. which replaces the <code>field</code>

 "rarity": 


 {
	"_meta": {
		"sources": [
			{
				"json": "Item Sampler Template",
				"abbreviation": "",
				"full": "Item Sampler",
				"authors": [
					"5eTools"
				],
				"version": "1.0.0",
				"url": "https://github.com/TheGiddyLimit/homebrew",
				"targetSchema": "1.0.0",
				"comment": "These comment fields are unnecessary and can be deleted.",
				"comment1": "This is an attempt at a template for other's reference to help with examples for each item type and how it is structure for people as unfamiliar as myself with the structure.",
				"comment2": "It uses unnecessary duplicates of  “item: [” tag, you need only one if you are using this for multiple item entries - just keep the additional elements in the side the { }s"
			}
		]
	},


	"item": [
		{
			"name": "G = Adventure Gear",
			"type": "G",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "the name of the book/source",
			"page": 153,
			"entries": [
				"Description of the item."
			]
		}
	],
	"item": [
		{
			"name": "G = Adventure Gear, BUT... the Poison tag at the end specifices that they are poisons",
			"type": "G",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item."
			],
			"poison": true
		}
	],
	"item": [
		{
			"name": "A = Ammunition",
			"type": "A",
			"ammunition": true,
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item."
			]
		}
	],
	"item": [
		{
			"name": "Artist Tools",
			"type": "AT",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item."
			],			
			"additionalSources": [
				{
					"source": "<the name of the additional book/source>",
					"page": 79
				}
			],
			"additionalEntries": [
				"Details about the additional elements found in the additional source(s)",
				{
					"type": "entries",
					"name": "Components",
					"entries": [
						"Alchemist's supplies include two glass beakers, a metal frame to hold a beaker in place over an open flame, a glass stirring rod, a small mortar and pestle, and a pouch of common alchemical ingredients, including salt, powdered iron, and purified water."
					]
				}
			]
		}	
	],	
	"item": [
		{
			"name": "GS = Gaming Set",
			"type": "GS",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "the name of the book/source",
			"page": 150,
			"entries": [
				"Description of the item."
			]
		}
	],
	"item": [
		{
			"name": "Heavy Armor",
			"type": "HA",
			"armor": true,
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"reqAttune": "<YES> appears only if attument is required",
			"weight": "<weight in pounds>",
			"ac": 14,
			"stealth": true,
			"comment": "DELETE THIS - Stealth is part of the file only if they have a penalty for stealth (in which case... keep the previous line)",
			"source": "the name of the book/source",
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "Medium Armor",
			"type": "MA",
			"armor": true,
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"reqAttune": "<YES> appears only if attument is required",
			"weight": "<weight in pounds>",
			"ac": 13,
			"source": "the name of the book/source",
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "Light Armor",
			"type": "LA",
			"armor": true,
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"reqAttune": "<YES> appears only if attument is required",
			"weight": "<weight in pounds>",
			"ac": 13,
			"source": "the name of the book/source",
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "INS = Instrument",
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150
		}
	],
	"item": [
		{
			"name": "M = Melee Weapon",
			"type": "M",
			"axe": true,
			"weapon": true,
			"weaponCategory": "<Martial/Simple/Exotic>",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"dmg1": "{@dice 1d8}",
			"dmg2": "{@dice 1d10}",
			"dmgType": "<S (Slashing),P (Piercing),B (Bludgeoning),N (Necrotic),R (Radiant),>",
			"property": [
				"V (versitile)/T (Thrown)/F (Finesse)/R (Reach)/2H (Two Handed)/LD (Reloading)/AF (Ammunition)/BF (Burst Fire)/A (Ammunition)/L (Light)/S (Special)/H (Heavy)/RLD (Reload)"
			],
			"source": "<the name of the book/source>",
			"page": 149
		}
	],
	"item": [
		{
			"name": "R = Ranged",
			"type": "R",
			"weapon": true,
			"weaponCategory": "<Martial/Simple/Exotic>",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"dmg1": "1",
			"dmgType": "P (typically)",
			"property": [
				"V (versitile)/T (Thrown)/F (Finesse)/R (Reach)/2H (Two Handed)/LD (Reloading)/AF (Ammunition)/BF (Burst Fire)/A (Ammunition)/L (Light)/S (Special)/H (Heavy)/RLD (Reload)"
			],
			"range": "<short/long>",
			"source": "<the name of the book/source>",
			"page": 150
		}
	],
	"item": [
		{
			"name": "MNT = Mount",
			"type": "MNT",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"carryingcapacity": "<in pounds>",
			"speed": "<in feet>",
			"value": "<cost>",
			"source": "<the name of the book/source>",
			"page": 150
		}
	],
	"item": [
		{
			"name": "S = Shield",
			"type": "S",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"ac": 2,
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "M When it includes the weaponCategory set to Simple is a Simple Weapon",
			"type": "M",
			"weapon": true,
			"weaponCategory": "Simple",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"dmg1": "{@dice 1d4}",
			"dmgType": "<S (Slashing),P (Piercing),B (Bludgeoning),N (Necrotic),R (Radiant),>",
			"property": [
				"A (Ammunition)",
				"AF (Ammunition)",
				"BF (Burst Fire)",
				"F (Finesse)",
				"H (Heavy)",
				"L (Light)",
				"LD (Reloading)",
				"R (Reach)",
				"RLD (Reload)",
				"S (Special)",
				"T (Thrown)",
				"V (versitile)",
				"2H (Two Handed)"
			],
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]			
		}
	],
	"item": [
		{
			"name": "SCF = Spellcasting Focus/Component",
			"type": "SCF",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"source": "the name of the book/source",
			"page": 150,
			"entries": [
				"Description of the item."
			]
		}
	],
	"item": [
		{
			"name": "TAH = Tack and Harness",
			"type": "TAH",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]			
		}
	],
	"item": [
		{
			"name": "T = Tool",
			"type": "T",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			],	
			"additionalSources": [
				{
					"source": "<the name of the book/source>",
					"page": 150
				}
			],
			"entries": [
				"Explaination of expanded game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "TG = Trade Good",
			"type": "TG",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item."
			]
		}
	],
	"item": [
		{
			"name": "VEH = Vehicle",
			"type": "VEH",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item."
			]
		}
	],
	"item": [
		{
			"name": "OTH = Other",
			"type": "OTH",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item."
			]
		}
	],
	"item": [
		{
			"name": "P = Potion",
			"type": "P",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "RG = Ring",
			"type": "RG",
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"reqAttune": true,
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "RD = Rod",
			"type": "RD",
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"weight": "<weight in pounds>",
			"reqAttune": true,
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "SC = Scroll",
			"type": "SC",
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"value": "<cost>",
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			]
		}
	],
	"item": [
		{
			"name": "Staff (Note; not TYPE definition required)",
			"technology": "Staff",
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"weight": "<weight in pounds>",
			"reqAttune": true,
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			],
			"charges": 10,
			"attachedSpells": [
				"spells"
			]
		}
	],
	"item": [
		{
			"name": "WD = Wand",
			"type": "WD",
			"tier": "Minor/Major",
			"rarity": "<None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact>",
			"weight": "<weight in pounds>",
			"reqAttune": true,
			"source": "<the name of the book/source>",
			"page": 150,
			"entries": [
				"Description of the item.",
				"Explaination of its powers and game mechanics"
			],
			"charges": 10,
			"attachedSpells": [
				"spells"
			]
		}
	],
	"item": [
			{
				"name": "Wondrous Item",
				"wondrous": true,
				"tier": "Minor/Major/",
				"rarity": "None/Common/Uncommon/Rare/Very Rare/Legendary/Artifact",
				"source": "the name of the book/source",
				"entries": [
					"Description of the item.",
					"Explaination of its powers and game mechanics"			]
		},




	],

	"itemProperty": [
		{
			"abbreviation": "<1 or 2 letter abbreviation>",
			"source": "the name of the book/source",
			"entries": [
				{
					"type": "entries",
					"name": "Property Name",
					"entries": [
						"Description of the Property."					]
				}
			]
		}
	]
}

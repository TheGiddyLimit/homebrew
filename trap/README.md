## Traps and Hazards

Traps and Hazards are defined in the (DMG)Dungeon Master's Guide, XGE (Xanathar's Guide to Everything), and recently the UA ()





Bold features are required.

"trap": [
	{
		"**name**": "<name of the trap>",

		"**trapType**": "<MECH/MAG/CMPX>",

Trap types:
- MECH - Mechanical
- MAG - Magical 
- CMPX - Complex

		"**source**": "<source (from Meta)>",
		"page": #,
		"**entries**": [
			"<standard text formating>"
		],
		"additionalProperties": false,
		"**tier**": # (1-4)
		"**threat**": # (1-3)
		"**trigger**": [
			"<standard text formating>"
		],
		"initative note":[
			"<standard text formating>"
		],
		"**initative**": # (1-3)
		"eActive": [
			"<standard text formating>"
		],
		"eDynamic": [
			"<standard text formating>"
		],
		"eConstant": [
			"<standard text formating>"
		],
		"**countermeasures**": [
			"<standard text formating>"
		]
	}
]


"hazard": [
	{
		"**name**": "<name of the hazard>",

		"trapHazType": "<WTH/ENV/WLD/GEN>",

Hazard Type:
 - WTH - 
 - ENV - Enviromental
 - WLD - 
 - GEN - 

		"**source**": "<source (from "json": in Meta)>",
		"page": #,
		"**entries**": [
			"<standard text formating>"
		],
	}
]

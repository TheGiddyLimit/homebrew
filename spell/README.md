## Spells

---

Spells actually refer to both spells and psionic powers, the formating on this is bit more convoluted than some as much of it isn't required.



#### Example / Schema

---

Example (Sample file)[Sample - Giddy; Assorted Marginalia.json]

(Schema)[spells.json]



"spell": [
	{
		"name": "<name of spell>",
		"level": #,
    "school": "<from A, V, E, I, D, N, T, C, P>",
    
Type of spell:
 - A : Abjuration
 - V : Evocation
 - E : Enchantment
 - I : Illusion
 - D : Divination
 - N : Necromancy
 - T : Transmutation
 - C : Conjuration
 - P : Psionic Power

    "meta": {
			"ritual": true (only if its a ritual)
      "technomagic": true (only if its modern/techomagic)
		},
		"time": [
		  {
				"number": #,
				"unit": "<choose from action, bonus, reaction, minute, hour, day"
			}
		"range": {
			"type": "point",  (????)
			"distance": {
			  "type": "<choose from feet, miles, self, touch, special, unlimited, plane, sight>",
			  "amount": #
			}
		},
    "source": "BoLS 3pp",
  	"page": 10,


			],
			"range": {
				"type": "point",
				"distance": {
					"type": "feet",
					"amount": 100
				}
			},
			"components": {
				"v": true,
				"s": true,
				"m": "spider and a bit of webbing frozen in amber"
			},
			"duration": [
				{
					"type": "permanent"
				}
			],
			"classes": {
				"fromClassList": [
					{
						"name": "Sorcerer",
						"source": "PHB"
					},
					{
						"name": "Wizard",
						"source": "PHB"
					}
				]
			},
			"entries": [
				"You create a 20-foot cube of sticky webs at a point you can see. Abiding webs works identically to web, except as noted otherwise.",
				"These webs are crawling with tiny, harmless spiders. Damage to the web is repaired by the spiders that live in it, at the rate of one 5-foot cube per round (125 cubic feet; the entire volume of the webs can be sixteen times this size). This repair occurs on initiative count 20. If the webs are completely destroyed, the spell ends. The spiders themselves are immortal and need neither air nor food to survive; the magic of the spell produces more spiders as needed."
			]
		},
    
    
## Spell Template
    
    

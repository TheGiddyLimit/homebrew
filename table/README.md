## Tables

Tables, Tables are a mixed bit. They are a part of structural text in the "`entries`" these are most often used for rollable tables, but can be reference tables.

Mostly you can take the content from the "`entries`" tables and make a table for it.


#### Schemas & Example

Working Example (Tables Murder Evidence)[httP://github.com/TheGiddyLimit/Homebrew/table/Sample - Giddy; Murder Evidence.json]

The Schema specifics (Variant Rules)[httP://github.com/TheGiddyLimit/Homebrew/table/Sample - Giddy; Murder Evidence.json]

"table": [
	{
		"**name**": "<name of the rule>",
		"**source**": "<source (from "json": in Meta)>",
		"page": #,
		"chapter": 
		"caption": "<title on the table page>",
		"style": "<string>"   ----???? Don't know what this is
		"colLabels": [
			"<label for each column (one per column)>"
		],
		"colStyles": [

ColumnStyle : 
 - col-xs-<#> <text-align-center/text-align-right>

Column style # values must equal no more than 12, but may have 1/2 factions.
ie. 
- col-xs-2  
- col-xs-3-5

Alignment Style (by default the columns are left justified)
 - text-align-left/text-align - Left Justify the Column's contents
 - text-align-center - Center Justify the Column's contents
 - text-align-right - Right Justify the Column's contents
 - text-align-full - Full Justify the Column's contents

		"rowLabels": [
			"<label for each column (one per row)>"
		],
		"rowStyles": [

RowStyle : 
 - row-xs-<#> <text-align-center/text-align-right>

Row style # values must equal no more than 12, but may have 1/2 factions.
ie. 
- row-xs-2  
- row-xs-3-5

Alignment Style (by default the Rows are left justified)
 - text-align-left/text-align - Left Justify the Row's contents
 - text-align-center - Center Justify the Row's contents
 - text-align-right - Right Justify the Row's contents
 - text-align-full - Full Justify the Row's contents

		],
		"**rows**": [
			[
				""
			],
			[
				<additional entries>
			]

		"footnotes": 
		]
	}
]
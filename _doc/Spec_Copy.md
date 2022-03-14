# Bestiary JSON `"_copy"` Spec

The copy system allows an existing creature to be copied, with modifications, to create a new creature.

## Usage

```yaml
// replace values from the copy with values specified in the root
// (N.B. these are kept in the root to ease external tooling, instead of doing e.g.:
//    `name = name || _copy._set.name` we should always have basic info at the root level)
"name": "New Name",
"source": "New Source",
"page": 123,
"int": 10

"_copy": {
    "name": "Name of original",
    "source": "Source of original",

    // modify existing properties
    // key dictates the data to modify
    // values can be:
    // - a string operation (e.g. "remove")
    // - an object operation (e.g. a "replaceTxt" operation with various options)
    // - an array containing either/both of the above
    "_mod": {

        // apply to all text properties
        // text properties are: "action", "reaction", "trait", "legendary", "variant", and "spellcasting"
        "*": [
            {
                "mode": "replaceTxt", // replace text
                "replace": "the captain",
                "with": "Embric",
                "flags": "i"
            }
        ],
        // alternate single-operation version
        "*": {
             "mode": "replaceTxt",
             "replace": "the captain",
             "with": "Embric",
             "flags": "i"
        },

        // apply to _no_ properties (used for "special" operations which have their own specific implementations)
        "_": {
            "mode": "addSenses",
            "senses": []
        }

        "action": [
            // more on this syntax can be found later in the spec
            {
                "mode": "replaceArr",
                "replace": "Mace",
                "with": {
                    "name": "Staff",
                    "entries": [
                        "{@atk mw} {@hit 8} to hit, reach5 ft., ..."
                    ]
                }
            }
        ],

        "variant": "remove" // remove a property
    },


    // some properties are removed by default (e.g. page) since they don't make sense on modified copies
    // this can be used to override that behaviour
    "_preserve": {
        "page": true
    },

    // other properties, which depend on the data type (key of the array containing the object), e.g. ...
    // implementation is specific to whatever is intended to use the data
    "_traits": {
        "name": "Awakened",
        "source": "PHB"
    }
}
```

---

### Note: Monster "traits" JSON Spec

Essentially the same as the `"_copy"`, with the information encapsulated in an `"apply"` property. Here, `"_root"` is used as an equivalent for values which would be held in the root for a normal copy object.

---

### Modes

Modifiers have modes, these are:

#### replaceTxt

Regex replace text.

```yaml
{
    "mode": "replaceTxt",
    "replace": "the captain", // regex pattern to match
    "with": "Embric", // text to insert as replacement
    "flags": "i" // regex flags to use ("g" is always included by default)
}
```

#### appendStr

Append a string to an existing string (with optional joiner), or add a new string.

```yaml
{
  "mode": "appendStr",
  "str": "some text to append",
  "joiner": ", "
}
```

#### prependArr

Prepend items to an array.

```yaml
{
    "mode": "prependArr",
    // items can be a single item (shorthand)
    "items": {
        "name": "Control Water",
        "entries": [
            "..."
        ]
    }
}
```

#### appendArr

Append items to an array.

```yaml
{
    "mode": "appendArr",
    // items can be a single item (shorthand)
    "items": {
        "name": "Control Water",
        "entries": [
            "..."
        ]
    }
}
```

#### replaceArr

Replace named items in an array.
If the item does not have a name, this falls back on trying to replace string literals.

```yaml
{
    "mode": "replaceArr",
    "replace": "Mace", // name of target to replace
    // items can be an item or an array of items, or a string or array of strings
    "items": {
        // item to insert instead
        "name": "Staff",
        "entries": [
            "{@atk mw} {@hit 8} to hit, reach5 ft., ..."
        ]
    }
}
```

`"replace"` can alternately be of the form:

```yaml
{
    "regex": "a*b",
    "flags": "i"
}
// or
{
    "replace": {
        "index": 0 // replace item at index 0
    }
}
```

#### replaceOrAppendArr

Try to `replaceArr`, fall back on `appendArr`.

#### appendIfNotExistsArr

For each item, check if it exists in the target array; if not, append it to the target array.

```yaml
{
    "mode": "appendIfNotExistsArr",
    // items can be an item or an array of items
    "items": [
        "charmed",
        "poisoned"
    ]
}
```

#### insertArr

Insert items into an array at the specified index.
Note that these are applied in order of appearance. Note that index-based operations are brittle, and using them should therefore be avoided where possible.

```yaml
{
    "mode": "insertArr",
    "index": 1,
    // items can be an item or an array of items
    "items": {
        "name": "Staff",
        "entries": [
            "{@atk mw} {@hit 8} to hit, reach5 ft., ..."
        ]
    }
}
```

#### removeArr

Remove named or plain items from an array.

```yaml
{
    "mode": "removeArr",
    // name/array of names of item to remove
    "names": "Mace"
    // alternatively, if string items are to be removed
    "items": [
      "fire",
      "cold"
    ],
    // optional "-f" flag to avoid throwing errors on missing items -- useful for e.g. creature traits
    "force": true
}
```

#### calculateProp

Calculate a property, and add it to an object.

```yaml
{
    "mode": "calculateProp",
    "prop": "stealth",
    // formula gets eval'd
    "formula": "let v = (<$prof_bonus$> * 2) + <$dex_mod$>; v >= 0 ? `+${v}` : `-${v}`"
}
```

Note that these are calculated using the current object values. The order of operations is as follows:

- (Copy original object)
- Apply root properties
- (Any other required steps, e.g. `_traits` are applied)
- Sequentially apply `_mod`s, in order of appearance

Available variables are:

|Var|Notes|
|---|---|
|`prof_bonus`|Calculated from creature's CR
|`dex_mod`|

---

#### scalarAddProp

Add a scalar to a number or number-like property.

```yaml
{
    "mode": "scalarAddProp",
    // "prop": "*", this affects all properties
    "prop": "stealth",
    "scalar": 2
}
```

#### scalarMultProp

Multiply a number or number-like property by a scalar

```yaml
{
    "mode": "scalarMultProp",
    "prop": "average",
    "scalar": 2,
    "floor": true // if the resulting value should be floor'd (useful for division)
}
```

#### addSenses

Add senses to a statblock. If the creature has greater range in the same senses as those that would be added, no changes are made.

```yaml
{
    "mode": "addSenses",
    "senses": {
        "type": "darkvision",
        "range": 60
    }
}
```

#### addSkills

Add skills to a statblock. If the creature has greater skill bonuses in the same skills as those that would be added, no changes are made.

```yaml
{
    "mode": "addSkills",
    "skills": {
        "perception": 1, // "1" is "proficient"
        "stealth": 2 // "2" is "expertise"
    }
}
```

#### addSpells

Add spells to a spell trait. Requires the creature to already be a spellcaster, and only targets the first listed trait.

```yaml
{
    "mode": "addSpells",
    "spells": {
        "0": {
            "spells": [
                "{@spell ray of frost}"
            ]
        }
    }
}
```

#### replaceSpells

Replace spells in a spell trait. Requires the creature to already be a spellcaster, and only targets the first listed trait.

```yaml
{
    "mode": "replaceSpells",
    "spells": {
        "4": [
             {
                 "replace": "{@spell banishment}",
                 "with":"{@spell dimension door}" // can be an array
             }
         ]
    },
    "daily": {
        "1e": [
            {
                "replace": "{@spell banishment}",
                "with":"{@spell dimension door}" // can be an array
            }
        ]
    }
}
```

#### scalarAddHit

Add a scalar to `@hit` tags in a statblock

```yaml
{
    "mode": "scalarAddHit",
    "scalar": 2
}
```

#### scalarAddDc

Add a scalar to `@dc` tags in a statblock

```yaml
{
    "mode": "scalarAddDc",
    "scalar": 2
}
```

#### maxSize

Set a statblock's `size` to the maximum of the present value and the value provided.

```yaml
{
    "mode": "maxSize",
    // if the creature is "H" (huge), it will be set to "L" (large).
    //  Otherwise, it will keep it's current size
    "max": "L"
}
```

#### scalarMultXp

Multiply a creature's XP value by a scalar.

```yaml
{
    "mode": "scalarMultXp",
    "scalar": 0.5,
    "floor": true // if the resulting value should be floor'd (useful for division)
}
```

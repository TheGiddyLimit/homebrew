Homebrew JSONs compatible with 5etools. The [editor](https://5e.tools/makebrew.html) will be expanded to support more content types Eventually:tm:.

#### Getting Brew (automatically)
1. Hit the "Manage Homebrew" button (if available) on a 5etools page.
2. "Get Homebrew"
3. Click to add. Currently, the list only displays items from this repository.

#### Getting Brew (manually)
1. Browse for the file you want
2. Click "Raw" (top-right) and save it as .json
3. Load into 5etools via the Brew Manager

#### Getting Help

Join the [5etools Discord Server](https://discord.gg/nGvRCDs), and ask in the `#brew conversion` channel.

#### Requesting Additions/Updates

Join the [5etools Discord Server](https://discord.gg/nGvRCDs), and see the pinned message format in the `#brew conversion` channel. You can vote for your conversion request, or those of others, in the `#brew-tracker` channel.

#### Creating and Contributing

_**Note:** one large advantage of contributing to this repo, is that your files will be kept up-to-date as changes are made to the main site._

- The easiest way to make your own is to copy one of the existing 'brews as a template and use the main [5etools data](https://github.com/TheGiddyLimit/TheGiddyLimit.github.io/tree/master/data) as a reference.
    - The schemata for the main site data can be found [here](https://github.com/TheGiddyLimit/TheGiddyLimit.github.io/tree/master/test/schema)
- Contributions are welcome. For the GitHub-literate, make a pull request.* For everyone else, create an Issue and post a link to your file (PasteBin is fine), and I (or other maintainers, in future) can add it for you.

\* _See the article [here](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for a how-to._

A schema is available (`json.schema`) describing the layout of the and usage of the `_meta` property found in the various data files.

##### Conventions to Follow

There are a few conventions used which should be followed when creating homebrew:
 - Use tabs over spaces, "LF" as end-of-line, and UTF-8 (without BOM) encoding.
 - Format filenames as "Author Name; Homebrew Name.json"
 - Use a unique `"json"` source name; they should be uniquely identifiable across all homebrew. For example, for the hypothetical book "A History Of Dragons" by "A. N. Other," a sensible source name would be `"ANOtherHistoryOfDragons"`. Note that this text is never displayed, so can be as long and as ugly as required. While this is not enforced, we reserve the right to change data as required to avoid naming conflicts.
 - Use `https://github.com/TheGiddyLimit/homebrew` as the source URL for sources without one.
 - Only include content authors in the source `"author"` field; conversion credit should be given in a `"convertedBy"` field (with the same format).
 - Include a `"dateAdded"` property in file metadata, which is a Unix timestamp (in seconds) at which the file was added. See [here](https://github.com/TheGiddyLimit/homebrew/blob/master/spell/Sample%20-%20Giddy%3B%20Assorted%20Marginalia.json#L29) for an example of the structure; an example timestamp would be `1537874753`. You can view and copy the current Unix time [here](https://www.epochconverter.com/).

#### Useful links

 - https://5e.tools/renderdemo.html (a demo of the renderer and JSON format)
 - https://5e.tools/converter.html (a tool to convert text to stat blocks)
 - https://jsonlint.com/ (error-check your JSON)
 - https://code.visualstudio.com (top-notch text editor)

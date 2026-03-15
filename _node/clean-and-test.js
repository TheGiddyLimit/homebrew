import {BrewCleaner} from "5etools-utils"
import {Command} from "commander";

const program = new Command()
	.option("--dry", `If files should not be written`)
;

program.parse(process.argv);
const params = program.opts();

BrewCleaner.run({isDry: params.dry});

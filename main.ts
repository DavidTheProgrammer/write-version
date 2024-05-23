import { Command } from "npm:commander@12.1.0";
import { readPackageJson, writeToDestinationFile } from "./src/functions.ts";
import process from "node:process";

// Load the package.json file
const results = await readPackageJson();
const packageJson = JSON.parse(results);

// Write new CLI program
const program = new Command();
program.name("write-version")
  .description("A CLI to extract package.json data and write it to a file.")
  .version("0.3.0");

// write-version command
program.command("write-version")
  .description(
    '[Legacy] This writes the version from package.json to a specified file with format {"APP_VERSION": "x.x.x"}.',
  )
  .option("-w <path>", "The path to write the file to.")
  .action(async (options: { w: string }) => {
    await writeToDestinationFile({
      path: options.w,
      data: { "APP_VERSION": packageJson["version"] },
    });
  });

await program.parseAsync(Deno.args ?? process.argv);

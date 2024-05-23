import { mkdir, readFile, writeFile } from "node:fs/promises";
import { format, resolve } from "node:path";
import process from "node:process";

/**
 * A function to read the package.json file of the current project.
 * This function makes the assumption you're running the CLI from the root of the project.
 */
export async function readPackageJson(): Promise<string> {
  const RUNTIME_CWD = Deno.cwd() ?? process.cwd();
  const filePath = resolve(RUNTIME_CWD, "package.json");

  try {
    return await readFile(filePath, { encoding: "utf8" });
  } catch (error) {
    console.error(
      "Unexpected Error. package.json file not found or cannot be read",
    );
    console.error(error.message);
    const quitter = process ?? Deno;
    quitter.exit(1);
    return "";
  }
}

/**
 * Writes the APP_VERSION file to the specified path.
 * @param path The path to write the file to.
 * @param data The data to write to the file, must be JSON serialisable.
 * @param fileName The name of the file to write to.
 */
export async function writeToDestinationFile({
  path,
  data,
  fileName = "app-version.json",
}: {
  path: string;
  data: { [key: string]: string };
  fileName?: string;
}): Promise<void> {
  const RUNTIME_CWD = Deno.cwd() ?? process.cwd();
  const destinationPath = resolve(RUNTIME_CWD, path);
  console.log(`Writing data to ${destinationPath}`);
  try {
    // Create the destination directory
    // Write the file to the final path
    // Write the data to the file
    await mkdir(destinationPath, { recursive: true });
    const finalPath = format({ dir: destinationPath, base: fileName });
    const dataString = JSON.stringify(data);
    await writeFile(finalPath, dataString);
    console.log(`Data written to file`);
  } catch (error) {
    console.error("Unexpected Error. Cannot write to destination path");
    console.error(error.message);
    const quitter = process ?? Deno;
    quitter.exit(1);
  }
}

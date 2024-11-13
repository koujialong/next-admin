import fs from "fs";
import path from "path";
export function getBlogFiles(paths: string[]) {
  const folderPath = path.join(process.cwd(), ...paths);
  try {
    const files = fs.readdirSync(folderPath);
    return files;
  } catch (err) {
    console.error(err);
  }
  return [];
}

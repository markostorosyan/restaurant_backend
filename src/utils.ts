import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { InvalidPasswordException } from './exception/invalid-password.exception';
export async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 10);

  return hash;
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash);

  if (!isMatch) {
    throw new InvalidPasswordException();
  }

  return true;
}

export function createStorageDirectories(dirs: Array<string>) {
  try {
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        console.log('Directory does not exist.');
        console.log('Directory creating...');
        fs.mkdirSync(dir, { recursive: true });
        console.log('Directory created.');
      }
    }
  } catch (e) {
    console.log('An error occurred. creating directories: ' + e);
  }
}

export async function fileUpload(
  file: Express.Multer.File,
  directory: string,
  id: Uuid,
  productName: string,
) {
  const root = 'public/storage/' + directory;
  const path = root + '/' + id + productName + '.jpg';
  await fs.writeFileSync(path, file.buffer);
  return path;
}

export async function fileRemove(path: string): Promise<void> {
  try {
    fs.unlinkSync(path);
    console.log('Delete File successfully.');
  } catch (error) {
    console.log(error);
  }
}

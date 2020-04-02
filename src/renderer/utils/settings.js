  
import settings from 'electron-settings';
import fse from 'fs-extra';
import path from 'path';
import os from 'os';

export const docDir = path.join(os.homedir(), 'my-house');
const settingsPath = path.join(docDir, 'settings.json');
fse.ensureFileSync(settingsPath);

fse.outputFile(settingsPath,docDir,err=>{
    console.log(err);
})

settings.setPath(settingsPath);

export default settings;
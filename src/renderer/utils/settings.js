  
import settings from 'electron-settings';
import fse from 'fs-extra';
import path from 'path';
import os from 'os';

export const docDir = path.join(os.homedir(), 'my-house');
const settingsPath = path.join(docDir, 'settings.json');
export const cfgPath = path.join(docDir,'config.json')
var config = {"面积单位":["平米","亩"],"价格单位":["元","万元"]}

fse.ensureFileSync(settingsPath);
fse.pathExists(cfgPath).then(e=>{
    console.log(e)
    if(!e){
        fse.ensureFileSync(cfgPath);
        fse.writeJson(cfgPath,config).then((err)=>{
            console.log("写入配置文件成功")
        }).catch(err=>{
            console.log("写入配置文件失败")
        })
    }
}).catch(error => {
    console.log(error)
})

settings.setPath(settingsPath);

export default settings;
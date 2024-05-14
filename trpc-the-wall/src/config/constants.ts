import yaml from "js-yaml";
import fs from "fs";
import { ConstantsInterface } from "./interfaces/constant.interface";

let constants: ConstantsInterface = {
    YES: 1,
    NO: 0,
    SESSION_SECRET: "",
    DATABASE: {
        host: "",
        user: "",
        password: "",
        database: "",
        port: 3306
    }
};

try {
    let env_file = "development.env.yml";
    let fileContents = fs.readFileSync(__dirname+'/'+env_file, 'utf8');
    let data: any = yaml.load(fileContents);
    let env_constants: any = {};

    for(let key in data){
        env_constants[key] = data[key];
    }

    constants = { ...constants, ...env_constants };
} 
catch(err) {
    console.log('Error loading yml file', err);
    process.exit(1);
}

export const CONSTANT = constants;
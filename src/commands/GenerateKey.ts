import config from '../configs/config';
import CryptoJS from 'crypto-js';
import fs from 'fs';
import * as dotenv from 'dotenv'

dotenv.config();

const randomString = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

const randomValue = randomString(16)

const randomKey: any = CryptoJS.AES.encrypt(randomValue, config.cipher).toString();


const file = fs.readFileSync('.env').toString()
const changeKey = (fileContent: string) => new Promise((resolve) => {
  fileContent.replace('APP_KEY=', `APP_KEY= ${randomKey}`)
  resolve(fileContent)
});

changeKey(file).then((response : string)=> {
  fs.writeFileSync('.env', response)
})

console.log('Key added = '+ process.env.APP_KEY);



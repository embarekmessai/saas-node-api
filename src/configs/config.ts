import * as dotenv from 'dotenv'

dotenv.config()

type Config = {
    app_name: string;
    port: string;
    url: string;
    env: string;
    debug: string | boolean;
    key: string;
    cipher: string;
    locale: string;
    timezone: string;
    mongo_connection: string;
    pass_key: string;
    origin_url: string | Array<string>;
    time_zone: string;
}

const config: Config = {

    /**
     *  App name
     */
     
    app_name : process.env.APP_NAME || 'SAAS APP',
    
    /**
     *  Appo port
    */
    port : process.env.PORT || '3000',
    
    /**
     *  Appo url
    */
    url : process.env.URL || 'http://localhost',

    /**
     *  Environment ['production', 'developement']
     */
    env: process.env.ENV || 'development',
    
    /**
     *  Debug
    */
    debug: process.env.DEBUG || true,

    /**
     *  Encryption Key
     */
    key: process.env.APP_KEY,

    cipher: 'AES-256-CBC',

    /**
     *  Application Locale Configuration
     */
    locale : process.env.LANG || 'en',

    /**
     *  Application Timezone
     */
    timezone: process.env.TIMEZONE || 'UTC',

    /**
     *  MongoDB connection URL
     */
    mongo_connection: process.env.MONGO_URL,

    /**
     *  Password key
     */
    pass_key: process.env.PASS_SEC,

    /**
     *  Orgine url
     */
    origin_url: process.env.ORIGIN_URL,

    /**
     *  App default time zone
     */
    time_zone: process.env.TIMEZONE || 'Europe/Paris',
};

export default config;

type RandomString = (length: number) => string;

export const randomString: RandomString = (length : number = 8) => {
    let randomString : string = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        randomString += chars[Math.floor(Math.random() * chars.length)];
    }

    return randomString;
};
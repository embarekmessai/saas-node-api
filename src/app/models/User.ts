import { Schema, model, Document } from 'mongoose';

export type UserDocument = Document & {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: Date;

    accessToken: string;

    profile: {
        isActive: Boolean,
        mobile: string,
        mobile_confirmation: string,
        mobile_confirmed_at: string,
        description: string,
        address: string,
        city: string,
        postal_code: string,
        country: string,
        latitude: string,
        longitude: string,
        avatar: string,
        last_login: string,
        last_logout: string,
        isOnline: string,
        photos: string,
        presentation: string,
        whatsapp: string,
        facebook: string,
        youtube: string,
        instagram: string,
        snapshat: string,
        tiktok: string
    };
    createdAt: Date;
    updatedAt: Date;
    comparePassword: comparePasswordFunction;
    _doc:any;
};

type comparePasswordFunction = (candidatePassword: string) => boolean;

const userSchema = new Schema<UserDocument>(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        passwordResetToken: {type: String},
        passwordResetExpires: {type: Date},
        accessToken: {type: String},

        profile: {
            isActive: {type: Boolean, default: false},
            mobile: {type: String},
            mobile_confirmation: {type: Boolean},
            mobile_confirmed_at: {type: Date},
            description: {type: String},
            address: {type: String},
            city: {type: String},
            postal_code: {type: String},
            country: {type: String},
            latitude: {type: Number},
            longitude: {type: Number},
            avatar: {type: String},
            last_login: {type: Date},
            last_logout: {type: Date},
            isOnline: {type: Boolean},
            photos: [String],
            presentation: {type: String},
            whatsapp: {type: String},
            facebook: {type: String},
            youtube: {type: String},
            instagram: {type: String},
            snapshat: {type: String},
            tiktok:{type: String}
        }
    }, { timestamps: true }
    );

    const comparePassword: comparePasswordFunction = function (candidatePassword) {
        // Get Hashed Passowrd
        const hashedPassword = CryptoJS.AES.encrypt(candidatePassword, process.env.PASS_SEC).toString();
        if( hashedPassword === this.password ) {
            return true;
        }
        return false;
    };

export const User = model<UserDocument>('User', userSchema);
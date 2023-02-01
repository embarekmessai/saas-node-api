import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        isActive: {
            type: Boolean,
            default: false
        },
        mobile: {
            type: String,
            required: true
        },
        mobile_confirmation: {
            type: Boolean,
        },
        mobile_confirmed_at: {
            type: Date
        },
        description: {
            type: String
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        postal_code: {
            type: String
        },
        country: {
            type: String
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        avatar: {
            type: String
        },
        last_login: {
            type: Date
        },
        last_logout: {
            type: Date
        },
        is_online: {
            type: Boolean
        },
        photos: [String],
        presentation: {
            type: String
        },
        whatsapp: {
            type: String
        },
        facebook: {
            type: String
        },
        youtube: {
            type: String
        },
        instagram: {
            type: String
        },
        snapshat: {
            type: String
        },
        tiktok: {
            type: String
        }
    }
}, { timestamps: true });

export default model('User', userSchema);
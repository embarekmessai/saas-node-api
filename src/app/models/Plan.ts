import { Schema, model } from 'mongoose';

const planSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    monthly_price: {
        type: Number,
        required: true
    },
    yearly_price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    options: {
        name: {
            type: String,
        },
        value: {
            type: String,
        }
    }
}, { timestamps: true });

export default model('Plan', planSchema);

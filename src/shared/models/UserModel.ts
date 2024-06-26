import { model, Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

import { RoleEnum } from '../utils/enums';

export interface UserInterface {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: RoleEnum;
}

export interface UserMethodsInterface {
    comparePassword(password: string): Promise<boolean>;
}

const schema = new Schema<UserInterface & UserMethodsInterface>(
    {
        firstname: { type: String, required: true, minlength: 3, maxlength: 255 },
        lastname: { type: String, required: true, minlength: 3, maxlength: 255 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, required: true, enum: Object.values(RoleEnum), default: RoleEnum.CLIENT },
    },
    { timestamps: true },
);

schema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    } catch (error) {
        console.log(error);
    } finally {
        next();
    }
});

// Method to compare passwords
schema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

schema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret['password'];
        return ret;
    },
});

export type User = HydratedDocument<UserInterface & UserMethodsInterface>;

export default model('User', schema);

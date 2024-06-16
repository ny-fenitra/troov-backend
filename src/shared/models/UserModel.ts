import { model, Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserInterface {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

interface UserMethodsInterface {
    comparePassword(password: string): Promise<boolean>;
}

const schema = new Schema<UserInterface & UserMethodsInterface>(
    {
        firstname: { type: String, required: true, minlength: 3, maxlength: 255 },
        lastname: { type: String, required: true, minlength: 3, maxlength: 255 },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
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

schema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export type User = HydratedDocument<UserInterface & UserMethodsInterface>;

export default model('User', schema);

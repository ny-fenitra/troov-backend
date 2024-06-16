import { model, Schema, HydratedDocument } from 'mongoose';

export interface ObjectInterface {
    name: string;
    description: string;
}

const schema = new Schema<ObjectInterface>(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 255 },
        description: { type: String, required: true, minlength: 3, maxlength: 255 },
    },
    { timestamps: true },
);

export type Object = HydratedDocument<ObjectInterface>;

export default model('Object', schema);

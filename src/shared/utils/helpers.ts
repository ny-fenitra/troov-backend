import UserModel from '../models/UserModel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmailUnique = async (value: string, meta: any) => {
    try {
        const user = await UserModel.findOne({
            email: value,
            ...(meta.req.params.id ? { _id: { $ne: meta.req.params.id } } : {}),
        });

        if (user) {
            return Promise.reject('Email already exists');
        }

        return true;
    } catch (err) {
        console.error('Error in checking email uniqueness:', err);
        throw new Error('Server error');
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const passwordsMatch = (value: string, meta: any) => {
    if (value !== meta.req.body.password) {
        return Promise.reject('Passwords do not match');
    }

    return true;
};

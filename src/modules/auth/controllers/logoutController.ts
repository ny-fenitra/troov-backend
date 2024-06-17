import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
    return req.session.destroy(async () => {
        return res.status(200).json({ success: true, msg: 'Logged out!' });
    });
};

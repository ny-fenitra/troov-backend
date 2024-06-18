import { NextFunction, Request, Response } from 'express';

import { RoleEnum } from '../utils/enums';

export default (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user?.role === RoleEnum.ADMIN) {
        return next();
    }

    res.status(403).json({ msg: 'Access forbidden!' });
};

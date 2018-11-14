import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});

export const AppController: Router = router;
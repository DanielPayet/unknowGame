import { Router, Request, Response } from 'express';
import * as path from 'path';

const router: Router = Router();

router.get("/", (req, res) =>
    res.sendFile('index.html', { root: path.join(process.cwd(), "/dist/public/") })
);

router.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});


export const AppController: Router = router;
import { Router } from 'express';
import { getTest } from '../controllers/users_test.js';
const userRouter = Router();

userRouter.get('/api/users', (req, res) => {
    res.json({name: 42});
});

userRouter.get('/api/test/:id', getTest);

export default userRouter;

import { Router } from "express";
import { getUser, getUserById, createUser, updateUser, deleteUser, loginUser } from "../Controllers/userController";
import { authMiddleware } from "../../shared/config/middlewares/auth";
const userRoutes: Router = Router();
userRoutes.post('/login', loginUser);

userRoutes.get('/', getUser);
userRoutes.get('/:Usuario_id', authMiddleware,getUserById);
userRoutes.post('/', createUser);
userRoutes.put('/:Usuario_id', updateUser);
userRoutes.delete('/:Usuario_id', deleteUser);

export default userRoutes;

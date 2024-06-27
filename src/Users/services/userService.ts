import { UserRepository } from "../repositories/userRepositories";
import { User } from "../models/userModel";
import { DateUtils } from "../../shared/utils/DateUtils";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET || "";


const saltRounds = 10;

export class usersService {

    public static async login(name: string, password: string){
        try{
            const user = await this.getUserName(name);
            if(!user){
                return null;
            }
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return null;
            }

            const payload = {
                Usuario_id: user.Usuario_id,
                name: user.name,
                age: user.age,
                gender: user.gender
            }
            return await jwt.sign(payload, secretKey, { expiresIn: '15m' });

        }catch (error: any){
            throw new Error(`Error al logearse: ${error.message}`);
        }

    }

    public static async getAllUser(): Promise<User[]> {
        try{
            return await UserRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener empleados: ${error.message}`);
        }
    }

    public static async getUserById(userId: number): Promise<User | null> {
        try{
            return await UserRepository.findById(userId);
        }catch (error: any){
            throw new Error(`Error al encontrar empleado: ${error.message}`);
        }
    }

    public static async getUserName(name: string): Promise<User | null> {
        try{
            return await UserRepository.findByName(name);
        }catch (error: any){
            throw new Error(`Error al encontrar empleado: ${error.message}`);
        }
    }

    public static async addUser(user: User) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            user.created_at = DateUtils.formatDate(new Date());
            user.updated_at = DateUtils.formatDate(new Date());
            user.password = await bcrypt.hash(user.password, salt);
            return await UserRepository.createUser(user);
        } catch (error: any) {
            throw new Error(`Error al crear empleado: ${error.message}`);
        }
    }

    public static async modifyUser(userId: number, userData: User){
        try{
            const userFinder =  await UserRepository.findById(userId);
            const salt = await bcrypt.genSalt(saltRounds);

            if(userFinder){
                if(userData.name){
                    userFinder.name = userData.name;
                }
                if(userData.password){
                    userFinder.password = await bcrypt.hash(userData.password, salt);
                }
                if(userData.age){
                userFinder.age = userData.age;
                }
                if (userData.gender) {
                    userFinder.gender = userData.gender;
                }
                if(userData.deleted){
                    userFinder.deleted = userData.deleted;
                }
            }else{
                return null;
            }
            userFinder.updated_by = userData.updated_by
            userFinder.updated_at = DateUtils.formatDate(new Date());
            return await UserRepository.updateUser(userId,userFinder);
        }catch (error: any){
            throw new Error(`Error al modificar empleado: ${error.message}`);
        }
    }

    public static async deleteUser(userId: number): Promise<boolean> {
        try{
            return await UserRepository.deleteUser(userId);
        }catch (error: any){
            throw new Error(`Error al eliminar empleado: ${error.message}`);
        }
    }
}
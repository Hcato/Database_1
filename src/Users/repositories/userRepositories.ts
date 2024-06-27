import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { User } from "../models/userModel";

export class UserRepository{
    public static async findAll(): Promise<User[]> {
        return new Promise((resolve, reject) => { //le falta el rol_id(solo se hizo del user, faltan las demas tablas)
          connection.query('SELECT Usuario_id, name, age, gender  FROM Usuario', (error: any, results) => {
            if (error) {
              reject(error);
            } else {
              const users: User[] = results as User[];
              resolve(users);
            }
          });
        });
      }

      public static async findById(Usuario_id: number): Promise<User | null> {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM Usuario WHERE Usuario_id = ?', [Usuario_id], (error: any, results) => {
            if (error) {
              reject(error);
            } else {
              const employees: User[] = results as User[];
              if (employees.length > 0) {
                resolve(employees[0]);
              } else {
                resolve(null);
              }
            }
          });
        });
      }
      public static async findByName(name: string): Promise<User | null> {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM Usuario WHERE name = ?', [name], (error: any, results) => {
            if (error) {
              reject(error);
            } else {
              const employees: User[] = results as User[];
              if (employees.length > 0) {
                resolve(employees[0]);
              } else {
                resolve(null);
              }
            }
          });
        });
      }    
      public static async createUser(user: User): Promise<User> {
        const query = 'INSERT INTO Usuario (name, password, age, gender, deleted, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        console.log(user);
        return new Promise((resolve, reject) => {
          connection.execute(query, [user.name, user.password, user.age, user.gender, user.deleted, user.created_at, user.created_by, user.updated_at, user.updated_by], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              const createdUserId = result.insertId;
              const createdUser: User = { ...user, Usuario_id: createdUserId };
              resolve(createdUser);
            }
          });
        });
      }
      public static async updateUser(Usuario_id: number, UserData: User): Promise<User | null> {
        const query = 'UPDATE Usuario SET name = ?, password = ?, age = ?, gender = ?, deleted = ?, updated_at = ?, updated_by = ? WHERE Usuario_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [UserData.name, UserData.password, UserData.age, UserData.gender, UserData.deleted, UserData.updated_at, UserData.updated_by, UserData.Usuario_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                const updatedUser: User = { ...UserData, Usuario_id: Usuario_id };
                resolve(updatedUser);
              } else {
                resolve(null);
              }
            }
          });
        });
      }
      //revisar si la tabla se llama como "usuario" ya que se puso ese nombre en todos los metodos.
      public static async deleteUser(Usuario_id: number): Promise<boolean> {
        const query = 'DELETE FROM Usuario WHERE Usuario_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [Usuario_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                resolve(true); // Eliminación exitosa
              } else {
                resolve(false); // Si no se encontró el usuario a eliminar
              }
            }
          });
        });
      }
}
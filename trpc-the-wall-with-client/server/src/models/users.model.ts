import { OkPacketParams, format as mysqlFormat }  from "mysql2";
import DatabaseModel from './database.model';
import GlobalHelper from '../helpers/index.helper';
import { ResponseDataInterface } from '../config/interfaces/ResponseData.interface';
import { FetchUserByEmail, FetchUserData, LoginUserParams, RegisterUserParams } from '../config/types';

class UsersModel extends DatabaseModel {

    constructor(){
        super();
    }

    /* Function to login a users */
    loginUser = async (params: LoginUserParams) =>{
        let response_data: ResponseDataInterface<unknown> = { status: false, result: {}, error: null };

        try{
            let { result: [user_data] } = await this.fetchUserByEmail(params.email_address, "id, first_name, CONCAT(first_name, ' ', last_name) AS name, email_address, password, created_at") 
            response_data.message = user_data ? GlobalHelper.passwordIsValid(params.password, user_data.password) : "User does not exist in our database!";

            if(!response_data.message){
                delete user_data.password;

                response_data.status = true;
                response_data.result = user_data;
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to login.";
        }

        return response_data;
    }

    /* Function to register a user */
    registerUser = async (params: RegisterUserParams) =>{
        let response_data: ResponseDataInterface<unknown> = { status: false, result: {}, error: null };

        try{
            delete params.confirm_password;
            params.password = GlobalHelper.passwordEncryption(params.password);
            /* Make the first letter of each name to Uppercase separated by space */
            params.first_name = params.first_name.replace(/(^\w{1})|(\s+\w{1})/g, name => name.toUpperCase());
            params.last_name = params.last_name.replace(/(^\w{1})|(\s+\w{1})/g, name => name.toUpperCase());

            let register_query = mysqlFormat(
                'INSERT INTO users (first_name, last_name, email_address, password, created_at, updated_at) VALUES(?, NOW(), NOW())', 
                [Object.values(params)]
            );

            response_data = await this.executeQuery<OkPacketParams>(register_query) as ResponseDataInterface<OkPacketParams>;
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to register.";
        }

        return response_data;
    }

    /* Function to fetch user by email */
    fetchUserByEmail = async (email_address: string, selected_fields: string = '*') => {
        let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

        try{
            let fetch_user_query = mysqlFormat(
                `SELECT ${selected_fields} 
                FROM users
                WHERE email_address = ?`,
                [email_address]
            );
      
            response_data = await this.executeQuery<FetchUserByEmail>(fetch_user_query) as ResponseDataInterface<FetchUserData>;
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to fetch user by email.";
        }

        return response_data;
    }

}

export default UsersModel;
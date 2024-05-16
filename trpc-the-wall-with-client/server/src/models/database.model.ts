import Mysql from 'mysql2';
import { CONSTANT } from '../config/constants';
import { ResponseDataInterface } from '../config/interfaces/ResponseData.interface';

const DatabaseConnection = Mysql.createConnection(CONSTANT.DATABASE);

class DatabaseModel {

    constructor() { }

    /* Function to commmunicate to database */
    executeQuery = <QueryResult>(query: string) => {
        return new Promise((resolve, _reject) => {
            DatabaseConnection.query(query, (error, result) => {
                let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

                if(error){
                    response_data.error = error;
                }
                else{
                    response_data.status = true;
                    response_data.result = result as QueryResult;
                }

                resolve(response_data);
            });
        });
    }
}

export default DatabaseModel;
import { OkPacketParams, format as mysqlFormat }  from "mysql2";
import DatabaseModel from './database.model';
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";
import { CreateMessageParams, DeleteMessageParams, FetchDateTime, MessagesResultData } from "../config/types";

class MessagesModel extends DatabaseModel {

    constructor(){
        super();
    }

    /* Function to fetch messages and comments */
    fetchMessagesAndComments = async () => {
        let response_data: ResponseDataInterface<MessagesResultData[]> = { status: false, result: [], error: null };

        try{
            let fetch_user_query = mysqlFormat(
                `SELECT messages.id, messages.content, CONCAT(users.first_name, ' ', users.last_name) AS name, DATE_FORMAT(messages.created_at, '%Y-%b-%e %H:%i:%s') AS created_at,
                    CASE WHEN ANY_VALUE(comments.id) IS NULL THEN '[]'
                    ELSE
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', comments.id,
                                'content', comments.content,
                                'name', CONCAT(comment_users.first_name, ' ', comment_users.last_name),
                                'created_at', DATE_FORMAT(comments.created_at, '%Y-%b-%e %H:%i:%s')
                            )
                        ) 
                    END AS comments
                FROM messages
                INNER JOIN users
                    ON users.id = messages.user_id
                LEFT JOIN comments
                    ON comments.message_id = messages.id
                LEFT JOIN users AS comment_users
                    ON comment_users.id = comments.user_id
                GROUP BY messages.id
                ORDER BY messages.id DESC;`
            );

            response_data = await this.executeQuery(fetch_user_query) as ResponseDataInterface<MessagesResultData[]>;
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to fetch messages and comments.";
        }

        return response_data;
    }

    /* Function to create a message */
    createMessage = async(params: CreateMessageParams, name: string) => {
        let response_data: ResponseDataInterface<unknown> = { status: false, result: {}, error: null };

        try{
            let create_message_query = mysqlFormat(`INSERT INTO messages (user_id, content, created_at) VALUES(?, ?, NOW())`, Object.values(params));
            let create_message_response = await this.executeQuery(create_message_query) as ResponseDataInterface<OkPacketParams>;

            if(create_message_response.result?.insertId){
                let insert_id: number = create_message_response.result.insertId;
    
                if(insert_id){
                    let fetch_message_query = mysqlFormat(`SELECT DATE_FORMAT(created_at, '%Y-%b-%e %H:%i:%s') AS message_created_at FROM messages WHERE id = ?`, [insert_id]);
                    let { result: [{message_created_at}] } = await this.executeQuery<OkPacketParams>(fetch_message_query) as FetchDateTime<[{ message_created_at: string }]>;
                    response_data = create_message_response;
    
                    response_data.result = {
                        name,
                        id: insert_id,
                        content: params.content,
                        created_at: message_created_at
                    };
                }
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to create a message.";
        }

        return response_data;
    }

    /* Function to delete a message and its comments */
    deleteMessage = async(params: DeleteMessageParams) => {
        let response_data: ResponseDataInterface<unknown> = { status: false, result: {}, error: null };

        try{
            let delete_comments_query = mysqlFormat(`DELETE FROM comments WHERE message_id = ?;`, [params.message_id]);
            await this.executeQuery(delete_comments_query);

            let delete_message_query = mysqlFormat(`DELETE FROM messages WHERE id = ? AND user_id = ?;`, Object.values(params));
            response_data = await this.executeQuery(delete_message_query) as ResponseDataInterface<OkPacketParams>;
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Failed to delete a message.";
        }

        return response_data;
    }
}

export default MessagesModel;
import { OkPacketParams, format as mysqlFormat }  from "mysql2";
import DatabaseModel from './database.model';
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

class CommentsModel extends DatabaseModel {

    constructor(){
        super();
    }

    /* Function to create a comment */
    createComment = async(params: { user_id: number, message_id: number, content: string }, name: string) => {
        let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

        try{
            let create_comment_query = mysqlFormat(`INSERT INTO comments (user_id, message_id, content, created_at) VALUES(?, ?, ?, NOW())`, Object.values(params));
            let create_comment_response: any = await this.executeQuery<OkPacketParams>(create_comment_query);
            
            if(create_comment_response.result){
                let insert_id = create_comment_response.result.insertId;
    
                if(insert_id){
                    let fetch_comment_query = mysqlFormat(`SELECT DATE_FORMAT(created_at, '%Y-%b-%e %H:%i:%s') AS comment_created_at FROM comments WHERE id = ?`, [insert_id]);
                    let { result: [{comment_created_at}] }: any = await this.executeQuery(fetch_comment_query);
                    response_data = create_comment_response;
    
                    let comment_data = {
                        name,
                        id: insert_id,
                        message_id: params.message_id,
                        content: params.content,
                        created_at: comment_created_at
                    }
    
                    /* Generate a partial html for cooment */
                    // response_data.html = await EJS.renderFile(Path.join(__dirname, "../views/partials/comment.ejs"), { comment_data }, { async: true });
                }

            }

        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to create a comment.";
        }

        return response_data;
    }

    /* Function to delete a comment */
    deleteComment = async(params: { comment_id: number, user_id: number }) => {
        let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

        try{
            let delete_comment_query = mysqlFormat(`DELETE FROM comments WHERE id = ? AND user_id = ?;`, Object.values(params));
            response_data = await this.executeQuery(delete_comment_query) as any;
            response_data.status = !!response_data.result.affectedRows;

            if(!response_data.result.affectedRows){
                response_data.message = "Non-author comments cannot delete."   
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to delete a comment.";
        }

        return response_data;
    }
}

export default CommentsModel;
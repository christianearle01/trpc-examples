import { z } from "zod";
import CommentsModel from "../models/comments.model";
import { router, publicProcedure } from './../utils/trpc';
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";
import { error } from "console";


// TODO: Custom Error in data validation ?

export const commentRouter = router({
    /**
     * TODO: Add documentation HERE
     */
    createComment: publicProcedure
    .input(z.object({
        message_id: z.number(),
        content: z.string().min(5)
    }))
    .mutation(async (opts) => {
        let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

        try{
            let { input: { message_id, content }, ctx: { req: { session } } } = opts;
            
            /* Type check the user session to prevent the compile time error on accessing session.user properties */
            if(session?.user){
                let { id: user_id, name } = session.user;
                let commentsModel = new CommentsModel(); 
                await commentsModel.createComment({user_id, message_id, content}, name);
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Encountered an error in creating a comment."
        }        

        return response_data;
    }),

    /**
     * TODO: Add documentation HERE
     */
    deleteComment: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
        let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

        try{
            let { input: comment_id, ctx: { req: { session } } } = opts;

            if(session?.user){
                let commentsModel = new CommentsModel();
                response_data = await commentsModel.deleteComment({ comment_id, user_id: session.user.id })
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Encountered an error in deleting a comment."
        }        

        return response_data;
    })
});
import MessagesModel from '../models/messages.model';
import { ResponseDataInterface } from '../config/interfaces/ResponseData.interface';
import { router, publicProcedure } from './../utils/trpc';
import { z } from 'zod';

export const messageRouter = router({
    /**
     * TODO: Add documentation HERE
     */
    fetchMessagesAndComments: publicProcedure
    .query(async (opts) => {
        let messagesModel = new MessagesModel();
        let { result: messages_data } = await messagesModel.fetchMessagesAndComments();

        return messages_data;
    }),

    /**
     * TODO: Add documentation HERE
     */
    createMessage: publicProcedure
    .input(z.string().trim().min(5))
    .mutation(async (opts) => {
        let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

        try{
            let { input: content, ctx: { req: { session } } } = opts;

            /* Type check the user session to prevent the compile time error on accessing session.user properties */
            if(session?.user){
                let messagesModel = new MessagesModel();
                response_data = await messagesModel.createMessage({user_id: session.user.id, content}, session.user.name);
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Encountered an error in creating a message."
        }

        return response_data;
    }),

    /**
     * TODO: Add documentation HERE
     */
    deleteMessage: publicProcedure
    .input(z.number())
    .mutation(async (opts) => {
        let response_data: ResponseDataInterface<any> = { status: false, result: {}, error: null };

        try{
            let { input: message_id, ctx: { req: { session } } } = opts;

            /* Type check the user session to prevent the compile time error on accessing session.user properties */
            if(session?.user){
                let messagesModel = new MessagesModel();
                response_data = await messagesModel.deleteMessage({ message_id, user_id: session.user.id });
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Encountered an error in deleting a message."
        }

        return response_data;
    })
});
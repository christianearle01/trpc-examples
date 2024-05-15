import MessagesModel from '../models/messages.model';
import { ResponseDataInterface } from '../config/interfaces/ResponseData.interface';
import { router, publicProcedure, protectedProcedure } from './../utils/trpc';
import { z } from 'zod';

export const messageRouter = router({
    /**
     * DOCU: Procedure to fetch messages and its corresponding comment/s
     * Triggered: When visit the the wall page after login
     * Last Updated Date: May 15, 2024
     * @returns messages_data
     * @author CE
     */
    fetchMessagesAndComments: protectedProcedure
    .query(async (opts) => {
        let messagesModel = new MessagesModel();
        let { result: messages_data } = await messagesModel.fetchMessagesAndComments();

        return messages_data;
    }),

    /**
     * TODO: Add documentation HERE
     */
    createMessage: protectedProcedure
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
     * DOCU: Procedure to delete a message and its corresponding comment/s
     * Triggered: When delete a message
     * Last Updated Date: May 15, 2024
     * @input input
     * @returns response_data - { status: true, result: { delete_message_response_data }, error: null }
     * @author CE
     */
    deleteMessage: protectedProcedure
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
import { router, publicProcedure, protectedProcedure } from './../utils/trpc';
import { z } from 'zod';
import UsersModel from '../models/users.model';
import { ResponseDataInterface } from '../config/interfaces/ResponseData.interface';
import { FetchUserData } from '../config/types';

export const userRouter = router({
    /* Procedure to test if there is a session save, for testing */
    index: publicProcedure.mutation((opts) => {
        console.log(`check session`, opts.ctx.req.session);
        return "Hello The Wall";
    }),

    /**
     * DOCU: Procedure to login a user with the provided credentials
     * Triggered: When submit the login credentials in the login form
     * Last Updated Date: May 15, 2024
     * @input input - { email_address, password }
     * @returns response_data - { status: true, result: { login_response_data }, error: null }
     * @author CE
     */
    loginUser: publicProcedure
    .input(z.object({
        email_address: z.string().email().min(5),
        password: z.string().min(5, 'Password must be at least 5 characters long')
    }))
    .mutation(async (opts) => {
        let response_data: ResponseDataInterface<unknown> = { status: false, result: {}, error: null };

        try{
            let { input, ctx } = opts;
            let usersModel = new UsersModel();
            let login_response_data = await usersModel.loginUser(input);

            if(login_response_data.status){
                response_data = { ...login_response_data };
                let { id, first_name, name, created_at } = login_response_data.result as FetchUserData;

                if(!ctx.req.session?.user){
                    /* save user session in tRPC context  */
                    ctx.req.session.user = {
                        id, first_name, name,
                        date_time: created_at.toString()
                    }
                }
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Encountered an error upon login."
        }
       
        return response_data
    }),

    /**
     * DOCU: Procedure to register a user with the provided data
     * Triggered: When submit the register data in the register form
     * Last Updated Date: May 15, 2024
     * @input input - { first_name, last_name, email_address, password, confirm_password }
     * @returns response_data - { status: true, result: { register_response_data }, error: null }
     * @author CE
     */
    register: publicProcedure
    .input(
        z.object({
            first_name: z.string().trim().min(2),
            last_name: z.string().trim().min(2),
            email_address: z.string().email().min(5),
            password: z.string().min(5, 'Password must be at least 5 characters long'),
            confirm_password: z.string()
        })
        .refine((data) => (data.confirm_password === data.password), {
            message: 'Passwords do not match',
            path: ['confirm_password'],
        })
    )
    .mutation(async (opts) => {
        let response_data: ResponseDataInterface<unknown> = { status: false, result: {}, error: null };

        try{
            let { input, input: { email_address } } = opts;
            let usersModel = new UsersModel();
            let {result: [existing_email]} = await usersModel.fetchUserByEmail(email_address, "id, email_address");
            response_data.message = existing_email?.email_address ? "Email address already taken!" : "";
    
            if(!response_data.message){
                response_data = await usersModel.registerUser(input);
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
            response_data.message = "Encountered an error upon register."
        }

        return response_data;
    }),

    /* Procedure to logout the user and destroy the user session */
    logout: protectedProcedure.mutation((opts) => {
        opts.ctx.req.session.destroy((err) => {
            if(err){
              new Error('Failed to destroy session');
            }
            else{
                console.log(`Session destroy`, opts.ctx.req.session);
            }
        });

        return `Session destroy`;
    })
});
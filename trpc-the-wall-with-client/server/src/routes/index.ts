import { router } from './../utils/trpc';
import { userRouter } from "./user.routes";
import { commentRouter } from "./comment.routes";
import { messageRouter } from "./message.routes";

export const appRouter = router({
    user: userRouter,
    comment: commentRouter,
    message: messageRouter 
});
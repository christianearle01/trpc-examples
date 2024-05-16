import { Fragment, useEffect } from "react";
import { trpc } from "./trpc";
import { useNavigate } from "react-router-dom";

interface CommentsData {
    id: number;
    name: string; 
    content: string;
    created_at: string;
}

interface MessagesData<T> {
    id: number;
    name: string; 
    content: string;
    comments: T;
    created_at: string;
}

const Wall = () => {
    const navigate = useNavigate();
    /* constant to be reused in post message and comment mutation */
    const mutation_options = {
        onSuccess: () => {
            messagesComments.refetch();
        }
    };

    /* Fetch messages and comments upon Mounting */
    useEffect(() => {
        messagesComments.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Prepare procedures/function to be used on this component */
    const messagesComments = trpc.message.fetchMessagesAndComments.useQuery(undefined, {
        enabled: false, /* Disable automatic query on mount */
    });
    const messages_data: MessagesData<string>[] = messagesComments.data ?? [];
    const logout = trpc.user.logout.useMutation();
    const postMessage = trpc.message.createMessage.useMutation(mutation_options);
    const postComment = trpc.comment.createComment.useMutation(mutation_options);
    const deleteMessage = trpc.message.deleteMessage.useMutation(mutation_options);
    const deleteComment = trpc.comment.deleteComment.useMutation(mutation_options);

    /* Function to logout the user */
    const handleLogout = () => {
        logout.mutate();
        navigate("/");
    }

    /* Function to post a message */
    const handlePostMessage = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        const formData = new FormData(form);
        const content = formData.get('content') as string;

        postMessage.mutate(content);
        event.preventDefault();
    }

    /* Function to post a comment */
    const handlePostComment = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        const formData = new FormData(form);
        const message_id = formData.get('message_id') as string;
        const content = formData.get('content') as string;

        postComment.mutate({ message_id: parseInt(message_id), content });
        event.preventDefault();
    }
    
    /* Function to delete a message */
    const handleDeleteMessage = (event: React.MouseEvent<HTMLElement>) => {
        const message_id = event.currentTarget.getAttribute("message-id") as string;

        deleteMessage.mutate(parseInt(message_id));
        event.preventDefault();
    }

    /* Function to delete a comment */
    const handleDeleteComment = (event: React.MouseEvent<HTMLElement>) => {
        const comment_id = event.currentTarget.getAttribute("comment-id") as string;

        deleteComment.mutate(parseInt(comment_id));
        event.preventDefault();
    }

    return (
        <Fragment>
            <div className="container">
                <div className="container-fluid w-75">
                    <span className="position-absolute top-10 start-0 ms-5">
                        Welcome name
                    </span>
                    <span className="position-absolute top-10 end-0 me-5">
                        <button 
                            className="btn btn-danger" 
                            onClick={() => handleLogout()}>
                            Logout
                        </button>
                    </span>
                </div>

                <ul className="pt-5">
                    <form 
                        className="input-group w-50 mb-3" 
                        onSubmit={handlePostMessage}>
                        <textarea name="content" className="form-control rounded-3"/>
                        <input type="submit" className="btn btn-primary ms-2" value="Post a Message" />
                    </form>

                    <div>
                        {messages_data.map((message) => {
                            const comments: CommentsData[] = JSON.parse(message.comments);

                            return <li className="mt-4 ms-5 text-start">
                                <p>
                                    {message.name} ({message.created_at}) 
                                    <a className="link-underline-light text-danger ms-3 fw-bold" href="#" message-id={message.id} onClick={handleDeleteMessage}>X</a>
                                </p>
                                <p>{message.content}</p>
                
                                <ul className="text-end">
                                    {comments.map((comment) => {
                                        return <li className="mb-3">
                                            <p>
                                                {comment.name} ({comment.created_at}) 
                                                <a className="link-underline-light text-danger ms-3 fw-bold" href="#" comment-id={comment.id} onClick={handleDeleteComment}>X</a>
                                            </p>
                                            <span>{comment.content}</span>
                                        </li>
                                    })}
                                </ul>
                                
                                <div className="row">
                                    <span className="col" />
                                    <form 
                                        className="input-group w-50 col" 
                                        onSubmit={handlePostComment}>
                                        <input type="hidden" name="message_id" value={message.id} />
                                        <textarea name="content" className="form-control rounded-3"></textarea>
                                        <input type="submit" className="btn btn-primary ms-2" value="Post a Comment" />
                                    </form>
                                </div>
                            </li>
                        })}
                    </div>
                </ul>
            </div>
        </Fragment>
    );
};

export default Wall;

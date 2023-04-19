import router from './userRoutes.js'
import postRouter from './postRoutes.js'
import commentRouter from './commentRoutes.js'

const routerApi = (app) => {
    app.use("/api/v1/users", router);
    app.use("/api/v1/posts", postRouter);
    app.use("/api/v1/comments", commentRouter);
};


export default routerApi
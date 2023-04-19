import Comment from '../models/Comment.js';
import Post from '../models/Post.js'

const models = {
    comment: Comment,
    post: Post
}

const map = {
    comment: "replieOf",
    post: "post"
}

const create = async (payload,place,docId,id) =>{
    const doc = await models[place].findById(docId);

    if(!doc) throw new Error('no doc');

    const comment = new Comment({
        body: payload,
        author: id,
        [map[place]]: docId
    }).save()

    return comment;

}

export {
    create
}
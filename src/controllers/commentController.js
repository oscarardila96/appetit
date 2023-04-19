import Comment from '../models/Comment.js'
import {create} from '../services/commentService.js'

const createComment = async (req, res) => {
    
    const { body } = req.body;
    const { id, place } = req.params;
    const author = req.params.id
    console.log(author)
    try {
        const comment = await create(body, place, id, author);
        res.json(comment)
    } catch (error) {
        if (error.message === 'no-doc')
            res.status(404).json({msg:'doc not found'});
        return res.status(500).json({ message: error.message });
    }
};

const updateComment = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    // const uid = req.user.id;

    try {
            const comment = await Comment.findById(id);
        
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }
            // if (comment.author.toString() !== uid) {
            //     // console.log(uid)
            //     return res.status(401).json({ message: 'You dont have permission to update this comment'});
            // }
            const updatedComment = await Comment.findByIdAndUpdate(
                {_id: id},
                { ...body },
                { new: true }
            );

            res.json(updatedComment)
    } catch (error) {
        console.log(error)
    }
};
const replyComment = async (req, res) => {
    const authorId = req.params.id;
    const { id } = req.params;
    const { message } = req.body;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return response.error(req, res, 'Comment not found', 404);
        }

        const reply = await new Comment({
            author: authorId,
            body: message
        }).save();

        await Comment.findByIdAndUpdate(
            id,
            { $push: { replies: reply.id } },
            { new: true }
        );

        return res.status(200).json({msg: 'Reply comment update Successfully'});
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const deleteComment = async (req,res) =>{
    const {id} = req.params
    try{
        const comment = await Comment.findById(id)

        if (comment) {
            await Comment.deleteMany({replieOf: comment.id})
        }
        const commentDeleted = await Comment.findByIdAndDelete(id)
        if (!commentDeleted) {
            return res.status(404).json({msg: 'Comment  not found'})
        }
        return res.status(200).json({msg: 'Comment Deleted successfully'})

    }catch(error){
        console.log(error)
    }
};


// const createComment = async (payload, place, docId, socketId) => {
//     const { body, attached, author } = payload;
//     const newComment = new Comment({ body, attached, author, socketId });
    
//         if (place === 'comment') {
//         newComment.replieOf = docId;
//         } else {
//         newComment.post = docId;
//         }
    
//         await newComment.save();
//         const comment = await newComment.populate('author', 'username').execPopulate();
    
//         return comment;
// };


// const getComments = async (place, docId) => {
//     let query = { post: docId };
//     if (place === 'comment') {
//         query = { replieOf: docId };
//     }
//     const comments = await Comment.find(query).populate('author', 'username');
//     return comments;
// };

export { 
    updateComment, 
    createComment, 
    deleteComment,
    // getComments,
    replyComment
}
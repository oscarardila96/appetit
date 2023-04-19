import { model, Schema } from 'mongoose';

const commentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        body: {
            type: String,
            require: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'post'
        },
        active: {
            type: Boolean,
            default: true
        },
        attached: [String],
        replieOf: {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        },
        socketId: {
            type: String
        }
    },
    {
        toObject: { virtuals: true },///console.log
        toJSON: { virtuals: true },//res
        timestamps: true,
        versionKey: false
    }
);


commentSchema.virtual("reply", {
    ref: "comment",
    localField: "_id",
    foreignField: "replieOf",
})

// commentSchema.virtual("reactions",{
//     ref:"reaction",
//     localField:"_id" ,
//     foreignField:"comment",
// })

// const reactions = ['megusta', 'meinteresa', 'apoyar', 'hacergracia'];

// reactions.forEach((reaction) => {
//     commentSchema.virtual(reaction, {
//         ref: 'reaction',
//         localField: '_id',
//         foreignField: 'comment',
//         match: { type__Reaction: reaction },
//         count: true
//     });
// });

// commentSchema.methods.toJSON = function idSetter() {
//     const { _id, ...Comment } = this.toObject();
//     Comment.id = _id;
//     return Comment;
// };

const Comment = model('comment', commentSchema);

export default Comment;


import { model, Schema } from 'mongoose';
import generateJWT from '../helpers/generateJWT.js';
import generateId from '../helpers/generateId.js';
import bcrypt from "bcryptjs";


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: true //TODO: CAMBIAR EN PRODUCCIÓN
    },
    img_avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    },
    bio: {
        type: String,
        maxlength: 200
    },
    location: {
        type: String
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isOnline: {
        type: Boolean,
        default: false
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    id:{
        type: String,
        default: generateId(),
    },
    token: {
        type: String,
        default: generateJWT()
    },
    savedPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }],
    socketId: {
        type: String
    },
    favoriteUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
},
    {
        toObject: { virtuals: false }, //console
        toJSON: { virtuals: true }, //res
        timestamps: true,
        versionKey: false
    }
);

UserSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew) {
        const hash = bcrypt.hashSync(this.password, 10);
        this.password = hash
        next();
    } else {
        return next()
    }
})

const User = model('User', UserSchema);

export default User;

/**
 * @openapi
 * components:
 *   schema:
 *     register:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Andres
 *         email:
 *           type: string
 *           example: andres@gmail.com
 *         password:
 *           type: string
 *           example: password123
 *     registerResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 6434daf028a9c3cf3a42f6e8
 *         name:
 *           type: string
 *           example: Andres
 *         email:
 *           type: string
 *           example: andres@gmail.com
 *     loginResponse:
 *       type: object
 *       properties:
 *         email: 
 *           type: string
 *           example: andres@gmail.com
 *         id:
 *           type: integer
 *           example: 6434daf028a9c3cf3a42f6e8
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *         name:
 *           type: string
 *           example: Andres
 *         imgAvatar:
 *           type: string
 *           example: https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
 *     user-profile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Andres
 *         email:
 *           type: string
 *           example: andres@gmail.com
 *         password:
 *           type: string
 *           example: password123
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
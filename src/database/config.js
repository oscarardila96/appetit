import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

connection().catch((err) => res.send(err));

async function connection() {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_ATLAS);
    console.log('Conectado a Mongo Atlas');
}

export default connection;

import { connect } from "mongoose"
import dotenv from 'dotenv';

dotenv.config();

export const connection_db = async () => {
    connect(process.env.CONNECTION_DB_URI)
        .then((conn) => console.log(`Database connected: ${conn.connection.host}`))
        .catch(error => {
            console.log("Error connecting to database", error)
        })
};
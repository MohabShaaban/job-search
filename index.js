import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import  schema  from './src/GraphQl/schema.js'


import { connection_db } from './database/connection.js';
import { globalErrorHandler } from './src/middlewares/error/global-error-handler.middleware.js';
import { ApiError } from './src/utils/api-error.utils.js';

import userRouter from './src/modules/user/user.routes.js';
import companyRouter from './src/modules/company/company.routes.js';
import jobRouter from './src/modules/job/job.routes.js';




const app = express();

connection_db();

app.use(express.json());
app.use('/uploads', express.static('uploads'))


// ===> Routes
app.use('/users', userRouter);
app.use('/companies', companyRouter);
app.use('/jobs', jobRouter)

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.use('/', (req, res, next) => {
    res.send('welcome to job search api')
})

// Middleware Route NOT FOUND Error handler
app.use('*', (req, res, next) => {
    return next(new ApiError(`This path ${'url: ' + req.protocol + '://' + req.get('host') + req.originalUrl} isn't on this server!`, 404))
})

// Middleware Global Error handler for express
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => { console.log(`listening on PORT: ${PORT}`) });

//@desc   Handle rejection outside express ex: database
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection Error:   ErrorName:${err.name}  |  ErrorMessage:${err.message}`);
    server.close(() => {
        console.error(`Shutting down...`);
        process.exit(1);
    })
});

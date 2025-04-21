require('dotenv').config();
const app = require('./index');


const PORT = process.env.PORT;

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
  
process.on("unhandledRejection", (err) => {

    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});
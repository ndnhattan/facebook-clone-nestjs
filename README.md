# Facebook Clone NestJS

This is the backend for the [Facebook Clone React](https://github.com/ndnhattan/facebook-clone-reactjs) project.

# Installation & Setup

## Pre-requisites

- Node.js
- MySQL Server (or any SQL database that is supported by TypeORM).

## Setting up the Backend

1. Clone the repository.
2. Run `yarn install` to install dependencies.
3. Create a `.env.development` file in the root directory and paste the following:

   ```
   PORT=
   CLIENT_URL=

   MYSQL_DB_HOST=
   MYSQL_DB_USERNAME=
   MYSQL_DB_PASSWORD=
   MYSQL_DB_PORT=
   MYSQL_DB_NAME=

   ACCESS_TOKEN_SECRET=
   ACCESS_TOKEN_EXPIRES_IN=
   REFRESH_TOKEN_SECRET=
   REFRESH_TOKEN_EXPIRES_IN=
   ```

   - **`PORT`** The port your server will run on
   - **`MYSQL_DB_HOST`** The hostname for your MySQL database server
   - **`MYSQL_DB_USERNAME`** The username for your MySQL database
   - **`MYSQL_DB_PASSWORD`** The password for your MySQL user account
   - **`MYSQL_DB_PORT`** The port your MySQL server is running on (default 3306)
   - **`MYSQL_DB_NAME`** The name of your database (be sure to create it first otherwise an error will be thrown).

4. Run `yarn start:dev` or `npm run start:dev` depending on which package manager you use to start the project in development mode.

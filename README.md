# Storefront Backend Project

## Introduction

Ecommerce store backend api built using NodeJS.\
Unit Tests using Jasmine

## Running the project

1. Run `yarn` in the project directory
2. Create a `.env` file in the project with the format

`POSTGRES_HOST=127.0.0.1`\
`POSTGRES_DB=shopping_api_dev`\
`POSTGRES_TEST_DB=shopping_api_test`\
`POSTGRES_USER=pg_user`\
`POSTGRES_PASSWORD=pg_password`\
`BCRYPT_PASSWORD=verysecrettoken`\
`SALT_ROUNDS=10`\
`ENV=dev`

3. Make sure `dev` and `test` postgres dbs exist in your installation of PostgreSQL and your db username and password match in the `.env` file above.
4. Simply run `yarn watch` or alternatively\
   `yarn build` followed by `yarn run`\
   to run the server

## Running tests

1. Follow step 1 to step 3 above.
2. Run `yarn test` in the dir to run tests.

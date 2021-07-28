# JWT based authorization with mikro-orm for Nest.js

This is a code sample for my [article](https://trejgun.github.io/articles/jwt-based-authorization-for-nestjs)

## Installation

I assume you have node, yarn/npm and postgres

First of all you have to download dependencies
```bash
npm i
```

Then check config in
```bash
nano .env
```

and start in watch mode
```bash
npm run start
```

## Docker

Otherwise you can use docker 

```shell script
docker-compose up --build
```

Run Postgres DB in container
docker run --name postgres-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d mikro

## Usage 

### SingUp:
```bash
curl \
-X POST http://127.0.0.1:3000/auth/signup \
-d '{"email": "trejgun@gmail.com", "password": "simplepass", "roles":["admin"]}' \
-H "Content-Type: application/json"
```

This will give you accessToken and refreshToken
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyZWpndW5AZ21haWwuY29tIiwiaWF0IjoxNjI3MTExNDgzLCJleHAiOjE2MjcxMTE3ODN9.EnJ_Wi6dd9II4OCWxeAg8q8JZa0HJFxNE5wiJVevcmA",
  "refreshToken": "389e564a-7d73-4f64-b851-15e641cf5f40",
  "accessTokenExpiresAt": 1627111173278,
  "refreshTokenExpiresAt": 1629702873278
}
```
### Refresh
which is valid for 5 minutes, after this time you have to refresh it using
```sh
curl \
-X POST http://127.0.0.1:3000/auth/refresh \
-d '{"refreshToken": "389e564a-7d73-4f64-b851-15e641cf5f40"}' \
-H "Content-Type: application/json"
```

refreshToken is valid for 30 days, but can be destroyed manually
```sh
 curl \
 -X POST http://127.0.0.1:3000/auth/logout \
 -d '{"refreshToken: "2b1764be-a13f-4630-9696-09f9e0f2bbd7"}' \
 -H "Content-Type: application/json"
 ```

### Login
You can login again
```bash
curl \
-X POST http://127.0.0.1:3000/auth/login \
-d '{"email": "trejgun@gmail.com", "password": "simplepass"}' \
-H "Content-Type: application/json"
```

### Access
Put this accessToken in header of each of your subsequent requests
```bash
curl \
http://localhost:3000/users/profile \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyZWpndW5AZ21haWwuY29tIiwiaWF0IjoxNjI3MTExNDgzLCJleHAiOjE2MjcxMTE3ODN9.EnJ_Wi6dd9II4OCWxeAg8q8JZa0HJFxNE5wiJVevcmA"
```

Admin only access endpoint return all registered users
```bash
curl \
http://localhost:3000/users/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRyZWpndW5AZ21haWwuY29tIiwiaWF0IjoxNjI3MTExNDgzLCJleHAiOjE2MjcxMTE3ODN9.EnJ_Wi6dd9II4OCWxeAg8q8JZa0HJFxNE5wiJVevcmA"
```

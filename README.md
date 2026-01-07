# backend authentication system using 
- This is a backend authentication system that use jwt and oauth for authentication and authorization 
- jsonwebtoken( JWT ) and OAuth
- postgreSQL DataBase
- bcrypt
- cookie-parser

# dependencies

 - "@prisma/adapter-pg": "^7.2.0",
 - "@prisma/client": "^7.2.0",
 - "@quixo3/prisma-session-store": "^3.1.19",
 - "bcrypt": "^6.0.0",
 - "cookie-parser": "^1.4.7",
 - "cors": "^2.8.5",
 - "dotenv": "^17.2.3",
 - "express": "^5.2.1",
 - "express-session": "^1.18.2",
 - "jsonwebtoken": "^9.0.3",
 - "passport": "^0.7.0",
 - "passport-github2": "^0.1.12",
 - "passport-google-oauth20": "^2.0.0",
 - "pg": "^8.16.3"


# .env variables
 - PORT
 - JWT_SECRET
 - DATABASE_URL 

 - FRONTEND_URL

 - GOOGLE_CLIENT_ID
 - GOOGLE_CLIENT_SECRET
 - GOOGLE_CALLBACK_URL

 - GITHUB_CLIENT_ID
 - GITHUB_CLIENT_SECRET
 - GITHUB_CALLBACK_URL


# Routes

/auth/signup
/auth/login
/auth/logout

/auth/google
/auth/google/callback

/auth/github
/auth/github/callback

/home

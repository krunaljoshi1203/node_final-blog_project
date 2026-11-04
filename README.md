# Blog Project – Node.js Practical Exam

A complete multi-user blog application with JWT authentication (cookie-based), role-based access control, MongoDB population, EJS views, and a stylish responsive theme.

## Features

- User registration & login with JWT stored in HTTP-only cookie
- Role-based access (`admin` / `user`)
- Password hashing with bcrypt
- Article CRUD (create, read, update, delete)
- User-specific articles ("My Articles")
- Comments on articles
- Mongoose population (author & comments)
- Navbar partial with conditional links
- Stylish modern UI with responsive design

## Project Structure

```
blog-project/
├── controllers/
│   ├── authController.js
│   └── articleController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Article.js
│   └── Comment.js
├── routes/
│   ├── authRoutes.js
│   └── articleRoutes.js
├── views/
│   ├── partials/
│   │   └── navbar.ejs
│   ├── articleList.ejs
│   ├── myArticles.ejs
│   ├── articleForm.ejs
│   ├── articleItem.ejs
│   ├── login.ejs
│   └── register.ejs
├── public/
│   └── css/
│       └── style.css
├── .env
├── server.js
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v16+)
- MongoDB running locally (or update `MONGODB_URI` in `.env`)

## Setup & Run

```bash
# Install dependencies
npm install

# Make sure MongoDB is running, then start the server
npm start
```

Open http://localhost:3000

## Usage

1. Register a new account (choose User or Admin role for demo)
2. Login → JWT is set as a cookie
3. Create articles from "New Article"
4. View all articles or only yours under "My Articles"
5. Edit / Delete your own articles (or any as Admin)
6. Add comments to any article
7. Sign out clears the JWT cookie

## Environment Variables (.env)

```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/blog_project
JWT_SECRET=supersecretjwtkeyforblogproject123456
```

## Marks Mapping

| Section | Points | Implemented |
|---------|--------|-------------|
| 1. Project Setup | 5 | Express, EJS, dependencies, server |
| 2. Model – MongoDB | 5 | Article, User, Comment models |
| 3. User Model with Roles | 5 | Roles, bcrypt hashing |
| 4. Auth Controllers | 10 | Register, Login (JWT cookie), Logout |
| 5. Middleware & Routing | 10 | JWT middleware, role protection, CRUD routes |
| 6. User-Specific Articles | 10 | Population, my-articles, multiuser |
| 7. View Structure | 5 | All required EJS views + partial |
| 8. Stylish Theme | 5 | Custom CSS, modern design, responsive |
| 9. Navbar | 5 | navbar.ejs with conditional links |
| **Total** | **50** | |

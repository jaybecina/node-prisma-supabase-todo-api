# Node.js TypeScript Todo App with Supabase and Prisma

A RESTful Todo application built with Node.js, TypeScript, Express, Supabase for authentication, and Prisma as the ORM.

## Features

- User authentication (register, login, logout)
- Todo CRUD operations
- User-specific todos
- TypeScript support
- Prisma ORM
- Supabase authentication
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd node-prisma-supabase-todo-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL=postgresql://postgres:<password>@<your-project-id>.supabase.co:5432/postgres
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
PORT=8000
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Todos

- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## Project Structure

```
src/
├── config/
│   └── supabase.ts
├── controllers/
│   ├── userController.ts
│   └── todoController.ts
├── middleware/
│   └── auth.ts
├── routes/
│   ├── index.ts
│   ├── userRoutes.ts
│   └── todoRoutes.ts
└── index.ts
```

## Security

- Passwords are hashed before storage
- JWT-based authentication
- User-specific todo access
- CORS enabled
- Environment variables for sensitive data

## Error Handling

The application includes comprehensive error handling for:
- Authentication errors
- Database errors
- Validation errors
- General server errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
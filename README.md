# Team Aman Chawla - Real Estate Website

A modern, full-stack real estate website built with Next.js, Prisma, and PostgreSQL. This platform allows users to browse properties, submit enquiries, and provides an admin panel for managing properties, blogs, videos, and enquiries.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** or **pnpm** - Comes with Node.js
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aman
```

### 2. Install Dependencies

```bash
npm install
```

or if you prefer yarn:

```bash
yarn install
```

or if you prefer pnpm:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name?schema=public"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here-generate-using-openssl-rand-base64-32"

# Admin Credentials (for seeding)
ADMIN_EMAIL="admin@teamamanchawla.com"
ADMIN_PASSWORD="changeme123"

# Optional: Google Maps API (for Google Reviews)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key-here"
```

**Important Notes:**
- Replace `username`, `password`, and `your_database_name` with your PostgreSQL credentials
- Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- For production, use strong, unique values for all secrets
- The admin credentials will be used during database seeding (see below)

### 4. Create PostgreSQL Database

Make sure PostgreSQL is running, then create a new database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE your_database_name;

# Exit PostgreSQL
\q
```

Or using a GUI tool like pgAdmin or DBeaver.

## 🗄️ Database Setup

### 1. Generate Prisma Client

After setting up your database connection string, generate the Prisma Client:

```bash
npm run db:generate
```

or

```bash
npx prisma generate
```

### 2. Run Database Migrations

Create and apply database migrations:

```bash
npm run db:migrate
```

or

```bash
npx prisma migrate dev
```

This will:
- Create the database schema based on your Prisma schema
- Apply all pending migrations
- Generate Prisma Client

**Note:** On first run, this will create an initial migration with your complete schema.

### 3. Seed the Database

Seed the database with initial data (admin user, page stats, etc.):

```bash
npm run db:seed
```

or

```bash
npx tsx prisma/seed.ts
```

**What gets seeded:**
- Admin user with the email and password from `.env`
- Page statistics for all navbar items

**Default Admin Credentials (if using defaults):**
- Email: `admin@teamamanchawla.com`
- Password: `changeme123`

**⚠️ Important:** Change the admin password immediately after first login!

## ▶️ Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

To create a production build:

```bash
npm run build
npm start
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production application |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## 🏗️ Project Structure

```
aman/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── properties/        # Property pages
│   ├── blogs/             # Blog pages
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── features/          # Feature components
│   ├── layout/            # Layout components
│   └── sections/          # Page sections
├── lib/                   # Utility libraries
│   ├── api-client.ts      # API client
│   ├── prisma.ts          # Prisma client instance
│   └── validations/       # Zod schemas
├── prisma/                # Database configuration
│   ├── schema.prisma      # Prisma schema
│   ├── seed.ts            # Database seed script
│   └── migrations/        # Database migrations
├── public/                # Static assets
│   ├── uploads/           # User uploaded files
│   └── associations/      # Association logos
└── .env                   # Environment variables (create this)
```

## 🔐 Admin Panel Access

After seeding the database, you can access the admin panel at:

**URL:** `http://localhost:3000/admin/login`

Use the admin credentials from your `.env` file (or defaults if not set):
- Email: From `ADMIN_EMAIL` environment variable
- Password: From `ADMIN_PASSWORD` environment variable

## 🗃️ Database Management

### Prisma Studio

To visually browse and edit your database:

```bash
npm run db:studio
```

This opens Prisma Studio at [http://localhost:5555](http://localhost:5555)

### Creating New Migrations

When you modify `prisma/schema.prisma`, create a migration:

```bash
npm run db:migrate
```

This will prompt you to name the migration.

### Resetting Database (Development Only)

⚠️ **Warning:** This will delete all data!

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Run all migrations
4. Run the seed script

## 🔧 Troubleshooting

### Prisma Client Not Generated

If you see errors about Prisma Client, run:

```bash
npm run db:generate
```

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   # On Windows
   # Check Services or use pgAdmin
   
   # On macOS/Linux
   sudo service postgresql status
   ```

2. Check your `DATABASE_URL` in `.env` is correct
3. Verify database exists and credentials are correct

### Migration Issues

If migrations fail:
1. Check your database connection
2. Ensure you're using the latest Prisma schema
3. Try resetting (development only): `npx prisma migrate reset`

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process or use a different port
npm run dev -- -p 3001
```

## 🌐 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `NEXTAUTH_URL` | Yes | Base URL of your application | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth.js | Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | No | Admin email for seeding | `admin@teamamanchawla.com` |
| `ADMIN_PASSWORD` | No | Admin password for seeding | `changeme123` |
| `GOOGLE_MAPS_API_KEY` | No | Google Maps API key for reviews | `AIza...` |

## 📝 First Time Setup Checklist

- [ ] Install Node.js (v18+)
- [ ] Install PostgreSQL
- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Create `.env` file with all required variables
- [ ] Create PostgreSQL database
- [ ] Run `npm run db:generate`
- [ ] Run `npm run db:migrate`
- [ ] Run `npm run db:seed`
- [ ] Run `npm run dev`
- [ ] Access admin panel and change default password
- [ ] Verify the application is running correctly

## 🚢 Deployment

### Production Environment Variables

Ensure all production environment variables are set:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="production-secret-key"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="strong-password"
```

### Build for Production

```bash
npm run build
npm start
```

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database Migrations in Production

Before deploying to production, ensure all migrations are applied:

```bash
npx prisma migrate deploy
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

If you encounter any issues:
1. Check this README for common solutions
2. Review the troubleshooting section
3. Check application logs for error messages
4. Ensure all environment variables are correctly set

---

**Happy Coding! 🎉**

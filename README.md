# Digitaz Store

Digitaz Store is a modern e-commerce web application built with **Next.js, React, TypeScript, and PNPM**. It is a frontend-focused rebuild of the Digitaz e-commerce experience, designed with reusable components, responsive layouts, internationalization, dark mode, and a scalable project structure.

🚀 **Getting Started (Development)**

Make sure you have pnpm installed globally:

```bash
npm install -g pnpm
```

Install dependencies:

```bash
pnpm install
```

🧪 **Start Development Server**

```bash
pnpm dev
```

The app will be available at:

```text
http://localhost:3000
```

You can start editing the application inside the `src` directory. The page automatically updates as you edit the files.

🏗️ **Build for Local Production**

To build the application:

```bash
pnpm build
```

Then start the production server:

```bash
pnpm start
```

The application will run on the port configured in your environment variables.

🌍 **Internationalization**

Digitaz Store supports multiple languages using `next-intl`.

Available locales:

* English: `/en`
* Persian: `/fa`

The Persian version supports RTL layout.

⚙️ **Environment Variables**

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the required environment variables before running the application.

🗄️ **Database**

The project uses **Prisma** for database access.

To generate the Prisma client:

```bash
pnpm prisma generate
```

To apply the database schema:

```bash
pnpm prisma db push
```

To open Prisma Studio:

```bash
pnpm prisma studio
```

🐳 **Running with Docker**

The project includes Docker support for running the application in a production-like environment.

🔧 **Build and Start with Docker Compose**

```bash
docker compose up -d --build
```

This will:

* Build the Docker image
* Start the application container
* Serve the application using the configured port

🛑 **Stop the Container**

```bash
docker compose down
```

🛠️ **Tech Stack**

* Next.js
* React
* TypeScript
* PNPM
* Tailwind CSS
* next-intl
* React Query
* Prisma
* NextAuth
* React Hook Form
* Zod
* Lucide React
* Docker

📁 **Project Structure**

The project follows a feature-oriented structure with reusable components and Next.js Server Components by default.

```text
src/
├── app/
├── components/
├── features/
├── lib/
├── messages/
└── ...
```

📜 **Available Scripts**

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
pnpm format    # Format the codebase
```

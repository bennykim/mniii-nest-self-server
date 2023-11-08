# mniii-nest-self-server

This repository is dedicated to building and managing personal servers using the [NestJS](https://nestjs.com/) framework.
It encompasses features like login and a comprehensive REST API facilitating CRUD operations.

## Tech Stack

- **Main Technology:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Package Manager:** Yarn v3 (3.6.4)

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
- PostgreSQL must be installed and properly configured.
- Yarn v3 (3.6.4) is required for managing dependencies.

### Installation

1. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

2. Set up your PostgreSQL database and update the `prisma.schema` file with your database credentials.

3. Run migrations to create the necessary database tables:

   ```bash
   yarn prisma migrate dev
   ```

4. Start the development server:

   ```bash
   yarn start:dev
   ```

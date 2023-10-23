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

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/mniii-nest-self-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mniii-nest-self-server
   ```

3. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

4. Set up your PostgreSQL database and update the `prisma.schema` file with your database credentials.

5. Run migrations to create the necessary database tables:

   ```bash
   yarn prisma migrate dev
   ```

6. Start the development server:

   ```bash
   yarn start:dev
   ```

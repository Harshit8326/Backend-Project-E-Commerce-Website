# Node.js E-commerce Platform

This project is a robust E-commerce backend built using Node.js with Express framework and Sequelize ORM. Features include user management, order processing, JWT authentication, email notifications, Excel exports, and more.

## Features

- **User Management**: Register, login, and manage user profiles.
- **Order Processing**: Create, update, and manage orders with detailed product information.
- **Authentication**: Secure API endpoints using JWT tokens.
- **Email Notifications**: Send notifications on user registration and order updates.
- **Excel Export**: Export order details to Excel for easy reporting.

## Technologies Used

- **Node.js**: Backend JavaScript runtime.
- **Express**: Web application framework.
- **Sequelize**: ORM for database interactions.
- **JWT**: JSON Web Tokens for authentication.
- **ExcelJS**: Library for generating Excel files.
- **Nodemailer**: Module for sending emails.

## Getting Started

1. **Install Dependencies**: `npm install`
2. **Database Setup**: Configure database credentials in `config/config.json`.
3. **Run Migrations**: `npx sequelize-cli db:migrate`
4. **Start Server**: `npm start`

## Folder Structure

- **config/**: Configuration files including database setup.
- **controller/**: Route handlers for different entities.
- **migrations/**: Database migration files.
- **models/**: Sequelize model definitions.
- **routes/**: API endpoint definitions.
- **seeders/**: Data seeders for initial database population.
- **exports/**: Exported files such as Excel sheets.
- **node_modules/**: Dependencies installed via npm.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

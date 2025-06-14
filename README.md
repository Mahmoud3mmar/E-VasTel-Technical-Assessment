# Restaurant Management System API

A NestJS-based REST API for managing restaurant orders and generating comprehensive reports. Built with TypeScript, MongoDB, Redis caching, and comprehensive API documentation.

## 🚀 Live Demo

The application is live and available for testing on Vercel:
**[Live API Documentation](https://e-vas-tel-technical-assessment.vercel.app/api)**

## 📋 Features

- **Order Management**: Create, read, update, and delete restaurant orders
- **Report Generation**: Generate detailed reports and analytics
- **Redis Caching**: High-performance caching for improved response times
- **MongoDB Integration**: Robust data persistence with Mongoose
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Input Validation**: Comprehensive request validation with class-validator
- **Docker Support**: Containerized deployment ready

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **Containerization**: Docker

## 📦 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Redis** (local installation or Redis Cloud)
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd e-vas-tel-technical-assessment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Application
PORT=3000

# MongoDB Configuration
MONGODB_URI="your_mongodb_cloud_connection_string"

# Redis Configuration
REDIS_URL="your_redis_cloud_connection_string"

```

### 4. Start Required Services

Make sure MongoDB and Redis are running:

**MongoDB:**
```bash
 use MongoDB Atlas (cloud) - update MONGODB_URI accordingly
```

**Redis:**
```bash


 use Redis Cloud - update REDIS_URL accordingly
```

### 5. Run the Application

#### Development Mode (with hot reload)
```bash
npm run start:dev
```


The application will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## 🐳 Docker Deployment

### Build and Run with Docker

1. **Build the Docker image:**
```bash
docker build -t restaurant-management-api .
```

2. **Run the container:**
```bash
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_connection_string \
  -e REDIS_URL=your_redis_connection_string \
  restaurant-management-api
```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Local**: http://localhost:3000/api
- **Live Demo**: [YOUR_VERCEL_LINK_HERE/api](https://e-vas-tel-technical-assessment.vercel.app/api)

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive testing interface


## 🏗️ Project Structure

```
src/
├── common/           # Shared utilities 
├── orders/           # Order management module
├── reports/          # Report generation module
├── app.controller.ts # Main application controller
├── app.module.ts     # Root application module
├── app.service.ts    # Main application service
└── main.ts          # Application entry point
```


## 🌐 Deployment

### Vercel Deployment

This application is configured for easy deployment on Vercel:

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

**Live Application**: [YOUR_VERCEL_LINK_HERE](YOUR_VERCEL_LINK_HERE)




## 📝 License

This project is licensed under the UNLICENSED License - see the package.json file for details.

## 🆘 Troubleshooting


### Getting Help

- Check the [NestJS Documentation](https://docs.nestjs.com)
- Review the API documentation at `/api` endpoint
- Open an issue in this repository for bugs or feature requests

---

**Built with ❤️ using NestJS**

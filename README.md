# Mini-InstaPay

**Mini-InstaPay** is a simplified digital payment platform designed with scalability, maintainability, and security in mind. It offers essential financial features through a clean and user-friendly interface.

## 🔧 Key Features

* **Account Registration & Login**
  Secure user authentication and account creation.

* **Balance Management**
  Balance updates and validation.

* **Transaction History**
  Track all past transactions with timestamps and details.

* **Basic Reporting**
  Generate summaries and insights for user activity.

## 🧱 Architecture

Mini-InstaPay is built using a **microservices architecture**, where each service is:

* **Independent and Loosely Coupled**
  Designed to handle specific business functionalities.

* **Individually Deployable**
  Each service can be built and deployed separately.

### Main Services

* **User Management Service**
  Handles user registration, authentication, and profile management.

* **Transaction Service**
  Manages funds transfer between accounts and ensures transaction integrity.

* **Reporting Service**
  Provides reports on transaction activities and system usage.

## 🔄 Communication

Services communicate with each other via RESTful **HTTP APIs**, ensuring interoperability and modularity.

## 🚀 DevOps & Deployment

The platform is containerized using:

* **Docker**
  For consistent development and production environments.

* **Docker Compose**
  To manage multi-container applications during development and testing.

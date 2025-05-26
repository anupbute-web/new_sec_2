# Secrets Web Application

## Overview

The **Secrets** web application is designed to demonstrate robust authentication and security measures, ensuring a secure environment for users to share and manage their secrets confidently. This project focuses on implementing best practices in web security, providing comprehensive user protection and data integrity.

## Features

- **User Registration**:
  - Secure sign-up process requiring a name, email, and password.
  - Email format validation.
  - Password strength enforcement (minimum 6-8 characters, at least one lowercase letter, one uppercase letter, and one number).
  - Secure password storage using hashing algorithms.

- **Login Mechanisms**:
  - Secure login with email and password.
  - Email and password format validation.
  - Redirection to a protected page upon successful login displaying user information.

- **Session Management**:
  - Secure cookies with HttpOnly and SameSite attributes to prevent access from client-side scripts.
  - Token-based authentication using JSON Web Tokens (JWT) for stateless authentication.

- **Logout Mechanisms**:
  - Secure logout process.
  - Redirection to the login page after logout.

## Deployment

The application is deployed on Render. You can access the live application here:

🔗 [https://new-sec-2-1.onrender.com](https://new-sec-2-1.onrender.com)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Session Management**: HttpOnly cookies, SameSite cookies
- **Frontend**: EJS (Embedded JavaScript Templates)
- **Deployment**: Render

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/anupbute-web/new_sec_2.git
   cd secrets-web-app

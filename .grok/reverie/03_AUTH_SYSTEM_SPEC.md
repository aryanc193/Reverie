# Authentication Specification

## Auth Strategy
JWT Access Token + Refresh Token

## User Schema

Fields:
- name
- email
- passwordHash
- role
- isVerified
- refreshTokens
- createdAt
- updatedAt

## APIs

POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET /auth/me

## Middleware

### authenticate
- Extract JWT
- Verify signature
- Attach user to request

### authorize
- Role-based access

## Security
- Password hashing using bcrypt
- JWT expiry
- Refresh token rotation
- Rate limiting

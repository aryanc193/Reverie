# Backend Architecture

## Layers

### Routes
Receives HTTP requests.

### Controllers
Request validation and orchestration.

### Services
Business logic.

### Models
Mongoose schemas.

### Middleware
- Auth
- Validation
- Error handling
- Logging

### Utilities
Reusable helper functions.

## Suggested Structure

src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── utils/
├── validators/
└── app.js

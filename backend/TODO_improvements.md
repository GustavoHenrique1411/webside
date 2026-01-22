# Backend Improvements TODO

## Database Configuration
- [ ] Unify database config to use 'webside_db' consistently across db.js and config/database.js
- [ ] Ensure proper connection testing and error handling

## Server Refactoring
- [ ] Move all routes from server.js to separate route files
- [ ] Integrate auth.js route properly
- [ ] Create route files for leads, clientes, produtos, pedidos
- [ ] Update server.js to use route modules

## Authentication & Middleware
- [ ] Integrate authentication middleware from middleware/auth.js
- [ ] Ensure JWT secret is properly configured
- [ ] Add proper token validation

## Error Handling & Validation
- [ ] Add input validation for all endpoints
- [ ] Improve error responses with consistent format
- [ ] Add logging for better debugging

## Security & Best Practices
- [ ] Add rate limiting
- [ ] Implement CORS properly
- [ ] Add helmet for security headers
- [ ] Validate environment variables

## Testing
- [ ] Test all endpoints after refactoring
- [ ] Ensure database connections work
- [ ] Verify authentication flow

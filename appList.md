## authRouter

- POST /auth/Signup
- POST /auth/login
- POST /auth/logout

## ProfileRaouter

- GET /Profile/view
- PATCH /profile/edit
- PATCH /profile/password

## ConnectionRequestRouter

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## userRouter

- GET /user/request
- GET /user/connection
- GET /user/feed. gets you the other profiles from platform

## authRouter

- POST /auth/Signup
- POST /auth/login
- POST /auth/logout

## ProfileRaouter

- GET /Profile/view
- PATCH /profile/edit
- PATCH /profile/password

## ConnectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/approve/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/connection
- GET /user/request/received
- GET /user/feed. gets you the other profiles from platform

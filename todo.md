- [x] week 18 - seting up with local data, 
  - [x] video tue 27
  - [x] video wend 28 > maybe something is wrong here, idk 
- [x] week 19  - [place-things-into-the-database] 


  - [x] deploy the backend in render
  - [x] Your API should use Mongoose models to model your data and use these models to fetch data from the database.
  - [x] Your API should validate user input and return appropriate errors if the input is invalid.
  - [x] You should implement error handling for all your routes, with proper response statuses.
  - [x] video of tue
  - [x] i have commented out the back end, data seems to be fetch from the front, fix that! and fix the back end, i feel i'm almost there. 
  - [x] Ensure the frontend is sending the correct requests to the backend:
        - Check the request URLs and payloads.
        - Add logs to the frontend functions to debug the requests.
  - [x] video of wen jun 4th
  - [x] why is there no happy thought been shown?
  - [x] check the render deployment if it works
  - [x] check MongoDB
  - [x] render nad mongo are connected
  - [x] test the frontend connection to render with postman 
  - [x] try to fix error
  - [x] look throught all classes again and try to fix problem with my code
  - [x] seems not possible to add a thought, edit or remove a thuoght not even to like
  - [x] Your frontend should be updated with the possibility to Update and Delete a thought.
- [] week 20
  - [x] add a btn for edit, 
  - [x] add a btn for delete
  - [x] use postman to test the endpoint, results: 
  - [x] ADD THOUGHT POST /thoughts - **!!!FAILD!!!** 
     "error": "Failed to create thought" - 500 Internal Server Error
  - [x] LIKE THOUGHT - error 404 not found **!!!FAILD!!!**
  - [x] EDIT A THOUGHT **!!WORKS!!**
  - [x] DELETE A THOUGHT **!!WORKS!!**
  - [x] could the error be related to authentication?
  - [x] Editing, cancelling and creatign a new thought when working with the deployed database is not working. 
  - [] Your API should have routes to register and log in
  - [] Your endpoints to Create, Update and Delete should be authenticated
  - [] Your frontend should have a registration form which POSTs to the API to create a new user.
  - [] Your frontend should have a login form to authenticate the user.
  - [] Your passwords in the database should be encrypted with bcrypt.
  - [] You should implement error handling. Your API should let the user know if something went wrong. Be as specific as possible to help the user, e.g. by validating the user input when creating a new user, and return "That email address already exists". Include correct status codes. Error messages should also be shown on the frontend.
  - [] The validation should ensure unique email addresses and/or usernames, depending on how you'd like to structure your User model.
  
  = = = extras
  
  - [] make the edit text frame look nicer
  - [] make the text frame in edit expandable
  - [] should i use react router? 
  - [] clean up components in frontend
  - [] move the edit and delte btns

  
- [] Completion of one peer code review - on the backend repo.


  **NOTES**: maybe I have to fix the endpoints? Have to look at week 19 to check what are the mistaked with the diployed data, i think the problem is there. 
    - **13.06 - 16:08** it is fetching data from the deployed data, but seems i can't add likes, remove or edit anything
    - **video of we** got at min 00:34 

 = = = 

 API ROUTES & FEATURES
─────────────────────────────────────────────
[✔] Documentation (Express List Endpoints)
[✔] Read all thoughts
[✔] Read a single thought
[✔] Like a thought
[✔] Create a thought
[✔] Update a thought
[✔] Delete a thought
[ ] Create a thought (authenticated)
[ ] Update a thought (authenticated)
[ ] Delete a thought (authenticated)
[ ] Sign up
[ ] Log in

API DESIGN & QUALITY
─────────────────────────────────────────────
[✔] RESTful API
[✔] Clean code guidelines (partially, review for improvements)
[✔] Mongoose models for data
[✔] Input validation for thoughts
[ ] Input validation for users (unique email/username)
[✔] Error handling for thoughts
[ ] Error handling for users/auth
[ ] Password encryption with bcrypt

FRONTEND FEATURES
─────────────────────────────────────────────
[✔] Read thoughts
[✔] Like a thought
[✔] Create a thought
[✔] Update a thought
[✔] Delete a thought
[ ] Sign up
[ ] Log in
[ ] Error handling for auth

DEPLOYMENT
─────────────────────────────────────────────
[✔] API deployed to Render

SYNC FRONTEND & BACKEND
─────────────────────────────────────────────
[ ] Everything in backend reflected in frontend (auth, error handling, etc.)   




┌─────────────────────────────┐
│         API                │
├─────────────────────────────┤
│ Docs   [✔]                 │
│ Read   [✔]                 │
│ Read 1 [✔]                 │
│ Like   [✔]                 │
│ Create [✔] (auth [ ])      │
│ Update [✔] (auth [ ])      │
│ Delete [✔] (auth [ ])      │
│ Signup [ ]                 │
│ Login  [ ]                 │
│ Validation [✔] (users [ ]) │
│ Error handling [✔] (users[ ])│
│ Bcrypt [ ]                 │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│        FRONTEND             │
├─────────────────────────────┤
│ Read   [✔]                 │
│ Like   [✔]                 │
│ Create [✔]                 │
│ Update [✔]                 │
│ Delete [✔]                 │
│ Signup [ ]                 │
│ Login  [ ]                 │
│ Auth error handling [ ]    │
└─────────────────────────────┘
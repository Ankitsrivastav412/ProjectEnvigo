# Ankit Srivastav

Project -User Registration System

Project Explanation ->

In this Project First we have to Register the User, Afterthat we have to sign in that User, then we have to check the authencity of user after that we provide the access 
to the user with the help of authorization now the user can update and fetch the details by id.

For Creating this User Registration System
we have to built certain Api's i.e

1) post Api ->(To register User)
2) post Api ->(sign in the user)
3) put Api -> (update the user)
4) get Api -> (fetch the details of user) 

Project Approach ->

first we have to install Some important dependencies like - Express - to create Server; mongoose - to connect nodejs with database & defining Schema; Multer - to Send files in formdata; aws-sdk -to generate public link to store in our database; jwt - to handle  the authentication part;

In this Project we have to Make Model i.e (UserModel) in which we define Our Schema.

Afterthat In controller we write the Logics & for Validation we create another folder and import in Controller. and then we write our Api in route file. After that we test our Api's which we have Built.

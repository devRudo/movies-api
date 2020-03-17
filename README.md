# Movie Project

Run the following command:

> $ npm install

create new database in sql with the name movies

run following command to migrate and seed db with movies.json

> $ npm run db:migrate\
> $ npm run db:seed

After that API server can be started by running following command:

> $ npm run serve\
> API Server is running on port 3000

Go to the link http://localhost:3000/ to acceess the API documentation


##### Movies resource: To manage the entire collection of movies resource

###### URI : /api/movies
GET : to retrieve all movies\
POST : to add a new movie

##### Movies resource: To manage the sigle movie resource
###### URI: /api/movies/:movieId
GET : to retrieve a movie\
PUT : to update details of a movie\
DELETE : to remove a movie
##### Directors resource: To manage the entire collection of directors resource
###### URI : /api/directors
GET : to retrieve all directors\
POST : to add a new director
##### Directors resource: To manage a single director resource
###### URI: /api/directors/:directorId
GET : to retrieve a director\
PUT : to update details of a director\
DELETE : to remove a director
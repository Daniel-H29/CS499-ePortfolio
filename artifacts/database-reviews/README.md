# CS-465
CS-465 Full Stack Development 

## CS 499 Milestone Four: Trip Reviews Database Enhancement

The application now includes a separate MongoDB `reviews` collection. Each review references a trip by MongoDB ObjectId and also stores the trip code for efficient filtering. The schema validates reviewer names, email addresses, whole-number ratings from 1 through 5, and comments from 10 through 500 characters.

The API supports review listing, filtering, lookup, creation, updates, and deletion. Write operations require a valid JWT. The Angular administrative application includes a Reviews page for displaying, filtering, adding, and deleting review records.

To load the sample database records, run `node ./app_api/models/seed.js` from the `travlr` directory after MongoDB is running.

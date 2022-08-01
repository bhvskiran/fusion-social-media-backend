Packages installed - 
    express
    mongoose
    body-parser
    nodemon
    dotenv
    bcrypt

changes in package.json - 
    "type": "module",
    "scripts": {
        "start": "nodemon index.js"
        <!-- remove test script -->
    },

mongodb connection in index js

Server Configuration

index.js ---------------------> Routes -----------------> Controllers
    |                       ______|______                ______|______
    |                      |      |      |              |      |      |
    v                      v      v      v              v      v      v
starting point           Auth    User   Post          Auth    User   Post

The index.js calls different types of Routes.
Routes are basically path where to reach the specific Controllers.
Controllers are simply the javascript functions
Generally Models are the javascript schemas that our controllers will use to perform specific kind of functionality.
Express JSON Routes
===================
Make routes much easier to use in MVC format.


This is a fork of express-json-routes https://github.com/TopTierTech/express-json-routes, it add a controller configuration
for MVC style project.

How It Works
-------------


### 1.
For each `route.js` file in your routes folder add a `route.json` file.  In this JSON file, define your routes.
```javascript
{

    "VERB /route/path" : "function",
    "GET /simple/example" : "function",

    // configurable mapping
    "VERB /example/path" : {
        "handler"    : "function",
        "middleware" : "fileName:functionName",
        "regex"      : true | false
    }
}
```

-   The `VERB` can be any verb that express supports (`GET`, `POST`, `PUT`, `DELETE`) and must be UPPERCASE

### 2.
In your app.js file just include the module like
```javascript

// Includes
var express     = require('express');
var routes      = require('json-routing');

...

var app = express();
// setup stuff
app.set(...);
app.use(...);

routes(app);

```


### 3.
Create your logic code in ./controllers
```javascript

exports.init = function(req,res) {
    res.json({ code:1, message: 'hello' });
};

```


Other Options & Passing Variables
-----------------
So you want to pass variables into your routes file?  You'll love this!

When you initialize the module (step 3 above), you can specify a few options.  All are listed below with the default values.  An explaination follows.

```javascript

var routeOptions = {
    routes  : "./routes",
    controller: "./controllers",
    setup   : "init",
    vars    : null
}

routes(app, routeOptions);

```
-  routes      : the path to your routes folder (json definition).
-  controller  : the path to your controller folder (logic code).
-  setup       : the function you want called in your routes when they get loaded
-  vars        : an object you want passed into your setup function

For example, lets say you have a database connection you want to pass to all of your routes.


Thanks to
-----------------

express-json-routes for the work.
https://github.com/TopTierTech/express-json-routes
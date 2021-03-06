JSON Routes (for osseus)
===================

Forked [json-routing](https://github.com/gimox/json-routing) and updated to use with [osseus](ttps://github.com/colucom/osseus)

MAKE ME THE CODE
-------------

#### 1 init module

**Typescript**

```javascript
import {JsonRoute} from "json-routing";

const routeInfo:Array<any> = new JsonRoute(app, {
    "routesPath": "./api/routes",
    "processdir": __dirname
}).start();

```

**JS ES6**

```javascript
let Routing = require("json-routing")

let routeInfo = new Routing.JsonRoute(app, {
    "routesPath": "./api/routes",
    "processdir": __dirname
}).start();
```

#### 2 create routes

**Create a route file definition**

```json
{
"/admin": {
    "GET": {
      "route": "action",
      "policy": [
        "test:check",
        "test:all",
        "./subfolder/test2:index"
      ]
    },
    "POST": {
      "route": "action",
      "policy": [
        "test:all",
      ]
    }
 },
  "/dashboard": {
    "GET": {
      "route": "dashboard",
      }
  }

}
```


Routig with pure regular expression, add prefix "RE " before uri:

```json
{
  "RE /.*fly$/": {
    "GET": {
      "route": "index"
    }
  }
}
```


WHAT IS IT?
-------------
Make routes much easier to use in MVC format.
I've been searching for a while for a nodejs routing solution with a:

 -  simple configuration,
 -  super performance,
 -  simple code,
 -  MVC organization,
 -  manage only routing, no other auto magic api creation
 -  customizable
 -  least possible dependency

This is: json-routes.

How It Works
-------------

**The basic concepts.**
Create a json file with your routing config and add code logic in a external file called *controller* , creating an MVC style structure.

I followed the Expressjs 4 routing standards, helping the developer to manage the routes creation and project organization faster and in the standard synthax. Look at [express routing guide](http://expressjs.com/en/guide/routing.html)
 for a complet route pattern syntax 

Proposed Structure
-------------
This is an example of the default proposed structure, you can customize and change as you prefer.

```
project root
├── controllers/
│   ├── IndexController.js
│   ├── AuthController.js
│   ├── UsersController.js
├── policy/
│   │   ├── AuthorizationPolicy.js
│   │   ├── mymiddleware.js
├── routes/
│   │   │   ├── auth.json
│   │   │   ├── users.json
│   │   │   ├── index.json
├── app.js/
├── package.json/
├── README.md/
```
- **Controller**: contains the code's logic
- **Policy**: contains the function called before the controller = middleware
- **Routes**: contains all the `*.json` routing configuration. You can create as many *.json files as you need. By default, all routes within a file look up the corresponding controller (= modules = controllers = middleware) inside the controller's default directory `./controller` (or within the directory specified by the user), which uses the following naming format: Route-name (without .json) + "Controller.js (the first letter must be capitalized)".

> **EXAMPLE:**
> If you have a definition file called `users.json`, by default the route searches the controller `UsersControllers.js`.
For routes *auth.json* all routes call the controller `AuthController.js` ecc.. ecc..



> **NOTE:**  this is a proposed structure but you can configure the module for your structure, you can change dir structure or add all routes in a single file.


### Creating JSON Configuration file
The routing file is encoded in the JSON format and by **default is in `./routes.`**

Router is created using this syntax:

`{ "RoutePath" : {"verb": {options} } }`


*Example of extended config*

```javascript
{
   "routePath": {
    "VERB": {
      "route": "controller:method",
      "policy": [
        "controller:method",
      ]
    }
  },

  "/admin": {
    "GET": {
      "route": "action",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "./subfolder/test2:index"
      ]
    },
    "POST": {
      "route": "./mycustomfolder/controllername:index",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "./subfolder/test2:index"
      ]
    }
  },


 ...
  more routes
}
```


### RoutePath
This is the routing path and it follows the express4 standard routing. You can use jolly character and other type syntax `/admin*,` `/admin/:name` etc. etc.;


### Verb
Relates to the call verb and can assume any valid http verbs like GET, POST, PUT, DELETE etc etc. You can add more verbs for a single routePath:

```javascript
{
"/admin": {
    "GET": {
      "route": "action",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "./subfolder/test2:index"
      ]
    },
    "POST": {
      "route": "action",
      "policy": [
        "test:all",
      ]
    }

}
```

`/admin` has GET and POST  verbs.

### Route

Relates to `file:method` to call a route address.

By default, the routing search controller file inside the default controller directory is: `./controlles`, and you can change it using the global options explained in this document.

If the controller is not set, the routing will search a file called with the same name as the json file, with "Controller" as suffix.

> **Example:**
> If you have a definition file called `users.json`, by default the route searches the controller `UsersControllers.json`.
For routes *auth.json* all routes call the controller `AuthController.js` etc.. etc..


**Summarize route params**

If you omit the route params, the system routing assumes you have a default route controller path/name and a method called "index".

If you add only a parameter, it assumes that the controller is in the default directory with standard name `nameController.js` , and the parameter is the method that should be called. example route: "testall"

If the route params contain both values `./path/controllername:method` (user:index) it will search the controller using the default directory path structured as controller name followed by method. For example, route: "./test/user:index" searches for a controller called ./test/user with method index.

If you **need to call a controller in a subfolder**, simply add the path before the controller name. Example route: "./afolder/user:index", fire ./controller/afolder/user with method index.

If you **need to call a controller starting to your project root** simply add `.` before the path. Example route: "./lib/user:index", fire  ./lib/user.js with method index.



### Policy

Is a module/function called before the controller (= middleware), by default it calls a file in ./policy named as you set in parameters "fileName" and a function named as you set in "functionName".

Example: policy: "auth/index" calls ./policy/auth.js and method index

**The syntax is the same as `route` params**

It can be a string for a single policy or an array for multiple policy files.


### CORS
Enable or disable Cross-origin resource sharing. default is true, look at global options for more info.


### Regex
You can set a regex to validate your route, however I discourage using it. Instead, I prefer to add this logic in the controller for better code speed. **To set a rexeg route, use the prefix "RE " before pattern.**. 

```javascript
{
"RE /.*fly$/": {
    "GET": {
      "route": "action",
      "policy": [
        "./demo/policycustom/test:check",
        "test:all",
        "./subfolder/test2:index"
      ]
    }
}
```






### Init Module

Configure the routing modules in your main js file, as any other nodes modules.

```javascript
var routes = require('json-routing');
new routes.JsonRoute(expressApp, options).start();
```

Example:  

```javascript
// Includes
var express     = require('express');
var app         = express();
var routes      = require('json-routing'); // add module

...

// your code..
app.set(...);
app.use(...);

// this is the magic!
new routes.JsonRoute(app, {
     "processdir": __dirname
}).start();

```

**IT'S VERY IMPORTANT TO SET `processdir": __dirname` if your project is in a subfolder of root. (example ./src/)**


Change default Options
-----------------
When you initialize the module, you can specify a few options to customize the directory structure.
All are listed below with the default values.  An explanation follows.

your main.js file. 

```javascript
// Includes
var express     = require('express');
var app         = express();
var Routes      = require('json-routing'); // add module

// your code..
app.set(...);
app.use(...);

//define routes default options
var routeOptions = {
    routesPath      			: "./api/routes",
    controllerPath  			: "./api/controllers",
    policyPath      			: "./api/policy",
    cors            			: true,
    displayRoute    			: true,
    defaultAction   			: "index",
    processDir					: process.cwd(),
    controllerNameNoUppercase	: true
}

//init routes
var routeInfo = new Routes.JsonRoute(app, routeOptions);
```

-  routesPath      : the path to your routes folder. `Default ./routes`
-  controllerPath  : the path to your controller folder. `Default ./controllers`
-  policyPath      : the path to your policy folder. `Default ./policy`
-  cors            : enable cross origin resource sharing for all routes. (more cors options coming soon..). `Default false`
-  displayRoute    : display in console loading route info, `default true`.
-  defaultAction   : the function called in route if not specified. It's not so useful, but it's here!.`Default index`
-  processDir		  : The root base path of the project, default `process.cwd()` set as `__dirname` if you need to start in a subfolder or complex project.
-  controllerNameNoUppercase: option for controller names to not begin with uppercase. `Default false`

If you omit routeOptions or some params it use defaults values.

Change json file Global Options
-----------------
If you need to change options for all routes only for a specific *.json file, you can set in your file the key `GLOBAL` as in the following example:

user.json
```javascript
{
  "GLOBAL": {
    "controller": "./customdir/customControllerName",
    "policy":["config:setall","config:connection"],
    "baseUrl":"/user"
  },
   "/create": {
    "PUT": {
      "route": "index",
      "policy": [
        "auth:check",
        "auth:adduserparams"
      ]
    }
  }

}
```
Example: route controller is ./customdir/UserController.js


- controller: set a custom controller path for all routing file
- policy: is an array of policy `file:action` to fire before controller
- baseUrl: is a base path for all url routes in file. Example, inside a file all routes start with `/api/*`, i can set base url as `/api`. Now all file routes start with `/api`. If i have a routes `/users`, it fired when user called `/api/users`


> **NOTE:**  the key "GLOBAL" must be uppercase.



Full extended example
-----------------

*app.js*
```javascript
var express = require('express')
    , app = express()
    , port = process.env.PORT || 3000
    , routing = require('./lib/route');

/**
 * global options for routing
 *
 * set all file inside /api/* for a more cleaner code
 */
var routeOptions = {
    routesPath: "./api/routes"
    , controllersPath: "./api/controllers"
    , policyPath: './api/policy'
    , cors: false
    , processDir: __dirname
};

/**
 * init json-routing
 */
new routing.JsonRoute(app, routeOptions);

/**
 * standard express 4 routing
 * yes.. you can use both routing together if you need
 */
var router = express.Router();
router.get('/express/', function (req, res) {
    res.send(' this is a standard routing ');
});
app.use('/', router);

/**
 * server start
 *
 * @type {http.Server}
 */
var server = app.listen(port, function () {
    console.log('Listening on port %d', server.address().port);
});
```
This is the main file, we set routing and add global setting to use ./api as root directory



*./api/routes/users.json*
```javascript
{
   "/banned": {
    "GET": {
      "route": "./lib/bannedCustom:index",
      }
  },
   "/user": {
    "GET": {
      "route": "find",
      "policy": [
        "auth:check",
        "auth:adduserparams"
      ]
    },
     "PUT": {
      "route": "create",
      "policy": [
        "auth:check",
      ]
    }
  }

}
```
define the routes


*./api/controllers/UsersController.js*
```javascript
exports.index = function(req,res,next) {
    res.send(' index routes ');
};

exports.create = function(req,res,next) {
    res.send(' create routes params:'+req.params.name);
};
```
a basic controller logic

*./api/controllers/bannedCustom.js*
```javascript
exports.getbanned = function(req,res,next) {
    res.send(' custom controller name ');
};
```
this is the controller with custom name


*./api/policy/auth.js*
```javascript
exports.check = function(req,res,next) {
    if (!req.session.isLogged){
	     return  res.redirect('http://'+req.hostname+":3000/403");
    }
    next();
};
```
Let me explain this policy: it checks if a user is logged, else set a redirect, so we can use the middleware to check ACL, authorization or get/set global vars, and this is very useful.





Create a Policy File and Pass vars to controller
-----------------
We encourage to use standard tecnique for best performance: use middleware.
using the full example described below we can create a standard policy file to attach a global var using `req`

*./api/policy/auth.js*
```javascript
exports.getbanned = function(req,res,next) {
    if (!req.session.isLogged){
	     return  res.redirect('http://'+req.hostname+":3000/403");
    }
    //use req
    req.session.lastPing = new Date();
    next();
};
```


**Read the value in the controller or policy**

*./api/controllers/bannedCustom.js*
```javascript
exports.getbanned = function(req,res,next) {
    res.send(' custom controller name, middleware loaded at: '+req.session.lastPing);
};
```

Case: using middleware
-----------------

A special case: if we want to add an authentication before some route, take a look at this example:

```javascript
{

 "/admin": {
    "GET": {
      "route": "index",
       "policy":["auth:check"]
     }
  }
}}
```
All `/dadmin` route calls the controller `auth`, so now `auth:check` is executed before all `index` function and it becomes
 a policy (=middleware) and for a clear structure i put the file in policy dir.


An alternative example use the global file option, all routes inside use "auth:check" middleware:

```javascript
{
 "GLOBAL": {
    "policy":["auth:check"],
    "baseUrl":"/admin"
  },
  
   "/dashboard": {
    "GET": {
      "route": "getItem",
      }
  },
   "/user": {
    "GET": {
      "route": "find",
    },
     "PUT": {
      "route": "create",
    }
  }

}}
```

Protected route with JWT
-----------------
You can protect a routes using [jwt](https://jwt.io/). Json-routing use [auth0/express-jwt](https://github.com/auth0/express-jwt).
To protect a route add a property `jwt:true` and set the global options for jwt as example.

**Before using jwt you need to install express-jwt manually: `npm install --save express-jwt`**


*Route file: protected.json* 
 
```  
{
  "/protected": {
    "GET": {
      "route": "index",
      "jwt": true
    }
  },
  "/notprotected": {
    "GET": {
      "route": "indexnot",
      "jwt": false
    }
  }
}
  
```
NB note to pretect a route we need to set `jwt:true`

In main file: server.ts/js

```  
...

export const routeInfo: Array<IRouteInfo> = new JsonRoute(app, {
    "processdir": __dirname,
    "jwt": {
        "secret": "12345678910abc"
    }
}).start();

...

```
NB in json-routing init we need to set jwt object with secret


DONE!!!!!

### jwt extra route for error
to make a better jwt unauthorized response we can add a specific route like this:

```
export const routeInfo: Array<IRouteInfo> = new JsonRoute(app, {
    "processdir": __dirname,
    "jwt": {
        "secret": "12345678910abc"
    }
}).start();


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"message": "invalid token..."});
    }

    next();
});

```

Add a global route prefix
-----------------
You can add a global prefix path for all routes set options.urlPrefix


```
export const routeInfo: Array<IRouteInfo> = new JsonRoute(app, {
    "processdir": __dirname,
    "urlPrefix":"/api/v1"
   
}).start();

```
All routes now start with `/api/vi`


Route validation params
-----------------
It can be done by express-validator using schema. Add `validators` object with: 

- params -> route params es /home/:id
- query  -> query params es -> /home?id=124
- boby   -> body params es post params like {"id":"1233"}

according [express-validator](https://github.com/ctavan/express-validator) "validation by Schema"

route file.json

```
{
  "/validateparam/:id": {
    "GET": {
      "route": "validateparam",
      "jwt": false,
      "validators": {
        "params": {
          "id": {
            "notEmpty": true,
            "isLength": {
              "options": [
                {
                  "min": 5,
                  "max": 10
                }
              ],
              "errorMessage": "Must be between 2 and 10 chars long"
            },
            "errorMessage": "id is required"
          }
        }
      }
    }
  }
}

```
**NB body-parser middleware is injected by json-routing, you can pass params in global params**



ALL OPTIONS
-----------------
```javascript
export interface IOptions {
    routesPath?: string
    , controllersPath?: string
    , policyPath?: string
    , processdir?: string
    , cors?: boolean
    , displayRoute?: boolean
    , defaultAction?: string
    , urlPrefix?: string
    , jwt?: {
        secret: any
    }
    , bodyParserUrlEncoded?: any
    , controllerNameNoUppercase?: boolean
}

... 

let options: IOptions;

...
// add params to optins object


let routeInfo:Array<any> = new Routes.JsonRoute(app, options}).start();

```




Example
-----------------
Look at ./demo for a fully working example.   


Changelog
-----------------
Check git [release history](https://github.com/gimox/json-routing/releases) 


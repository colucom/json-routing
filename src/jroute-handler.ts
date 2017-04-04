import {IOptions} from "./interfaces/IOptions";
import {IRouteInfo} from "./interfaces/IRouteInfo";
import {IHandler} from "./interfaces/IHandler";

import {RouteMiddleware} from "./route-middleware";
import {RouteController} from "./route-controller";


export class JrouteHandler {
    app: any;
    route: any;
    options: IOptions;
    json: any;
    baseUrl: string = "";
    routeController: RouteController;
    globalOptions: any;

    constructor(route: string, options: IOptions, app: any) {
        this.route = route;
        this.options = options;
        this.routeController = new RouteController(this.route.name, this.options);
        this.app = app;
    }

    set(): Array<IRouteInfo> {

        this.json = this.loadRoute();

        this.globalOptions = this.json.GLOBAL || {};
        delete this.json.GLOBAL;

        this.baseUrl = this.setBaseUrl(this.globalOptions.baseUrl);

        let routeInfo: Array<IRouteInfo> = [];

        for (let uri in this.json) {
            let info = this.parseRoutes(uri, this.json);
            routeInfo = [...routeInfo, ...info];
        }

        return routeInfo;
    }

    setBaseUrl(globalBaseUrl: string = "") {
        return globalBaseUrl + this.baseUrl;

    }

    loadRoute(): any | boolean {
        try {
            return require(this.route.path);
        } catch (ex) {
            console.log("\x1b[31m *** ROUTING FILE DEFINITION ERROR :" + this.route.path + "\x1b[0m");
            console.log("\x1b[31m All routes inside this file are not loaded, please check json syntax!\x1b[0m");
            return true;
        }
    }

    parseRoutes(uri, json) {
        let routeInfo: Array<IRouteInfo> = [];

        for (let verb in json[uri]) {

            let params = json[uri][verb];
            let pattern: string = this.baseUrl + uri;
            let handlers: IHandler = this.routeController.getHandler(params.route, this.globalOptions.controller);
            let middleware = new RouteMiddleware(this.options).get(params.policy, this.globalOptions.policy);

            let info = this.add(verb, pattern, middleware, handlers.fnc, handlers.name);

            routeInfo.push(info);
        }

        return routeInfo;
    }

    add(verb: string, pattern: string, middleware: any, handler: any, controllerName: string): IRouteInfo {

        verb = verb.toLowerCase();

        let status: string = "\x1b[31mFail\x1b[0m";

        try {
            this.app[verb](pattern, middleware, handler);
            status = "OK";

        } catch (ex) {
            status = "\x1b[31mFail\x1b[0m";
        }

        return {"verb": verb, "url": pattern, "controllerName": controllerName, "status": status};
    }


}
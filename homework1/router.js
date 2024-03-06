http = require("follow-redirects").https;
const requestLib = require("request").defaults({
    encoding: null,
});
const config = require("./config");
const fs = require("fs")
class Routes
{
    constructor(method,path,handler) {
        this.method = method
        this.path = path
        this.handler = handler
    }
    static badRequest(message){
      return{
          custom : 1,
          statusCode : 400,
          statusMessage : "Bad Request",
          message : message,
      };
    }
    static notFound(message) {
        return {
            custom: 1,
            statusCode: 404,
            statusMessage: "Not Found",
            message: message,
        };
    }
    static internalError(message) {
        return {
            custom: 1,
            statusCode: 500,
            statusMessage: "Internal Error",
            message: message,
        };
    }
    static successResponse(req, res, obj) {
        res.statusCode = 200;
        res.statusMessage = "OK";
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify(obj));
    }
}
class RouterController {
    constructor(routes) {
        this.routes = routes;
    }
    addRoute(route) {
        this.routes.push(route);
    }
    handleRequest(req, res) {
        const { method, url } = req;
        const matchedRoute = this.findMatchingRoute(method, url);

        if (matchedRoute) {
            try {
                matchedRoute.handler(req, res);
            } catch (error) {
                const internalErrorResponse = Routes.internalError("Internal server error occurred.");
                res.writeHead(internalErrorResponse.statusCode);
                res.end(JSON.stringify(internalErrorResponse));
            }
        } else {
            const notFoundResponse = Routes.notFound("Route not found.");
            res.writeHead(notFoundResponse.statusCode);
            res.end(JSON.stringify(notFoundResponse));
        }
    }
    findMatchingRoute(method, url) {
        const parsedUrl = new URL(url, 'http://localhost');
        return this.routes.find(route => {
            const routePathParts = route.path.split('/');
            const parsedUrlPathParts = parsedUrl.pathname.split('/');

            if (routePathParts.length !== parsedUrlPathParts.length) {
                return false;
            }

            for (let i = 0; i < routePathParts.length; i++) {
                if (routePathParts[i] !== parsedUrlPathParts[i] && !routePathParts[i].startsWith(':')) {
                    return false;
                }
            }

            return route.method === method;
        });
    }
}

module.exports = {
    Routes,
    RouterController
};

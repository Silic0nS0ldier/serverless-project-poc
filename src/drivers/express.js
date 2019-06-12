import { ApiRequest, ApiResponse } from "./core.js";

/**
 * Wraps a serverless function with an ExpressJS request handler driver.
 * @param {(req: ApiRequest, res: ApiResponse) => ApiResponse|Promise<ApiResponse>} func 
 * @returns {import("express").RequestHandler}
 */
export default function (func)
{
    return async function (eReq, eRes)
    {
        // Normalise inputs
        const req = new ExpressRequest(eReq);
        let res = new ExpressResponse(eRes);

        // Run function
        res = await Promise
            .resolve(func(req, res))
            .catch(function (reason) {
                res.body = "An exception has occured: " + JSON.stringify(reason);
                res.headers.set('Content-Type', "text/html");
                return res;
            });
        
        // Produce outputs
        res.send();
    };
}

class ExpressRequest extends ApiRequest
{
    /**
     * @type {import("express").Request}
     * @private
     */
    request;

    /**
     * @param {import("express").Request} req 
     */
    constructor(req)
    {
        super();
        this.request = req;
    }

    get url()
    {
        // TODO Unconfirmed
        return this.request.protocol + '://' + this.request.get('host') + this.request.originalUrl;
    }

    get method()
    {
        return this.request.method;
    }

    async body()
    {
        if (this.request.body)
            return this.request.body;
        throw new Error("Request has no body.");
    }

    async json()
    {
        // Parsing of JSON body is handed by express middleware
        return await this.body();
    }
}

class ExpressResponse extends ApiResponse
{
    /**
     * @type {import("express").Response}
     * @private
     */
    response;

    /**
     * @param {import("express").Response} res 
     */
    constructor(res)
    {
        super();
        this.response = res;
        this.headers.set('Content-Type', 'application/json');
    }

    send()
    {
        this.response.status(200);
        this.headers.forEach((val, key) => {
            this.response.setHeader(key, val);
        });
        this.response.send(this.body);
    }
}

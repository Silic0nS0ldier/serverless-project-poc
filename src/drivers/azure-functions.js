/** @tscheck */
import { ApiRequest, ApiResponse } from "./core.js";

/**
 * Wraps a serverless function with an Azure Functions driver.
 * @param {(req: ApiRequest, res: ApiResponse) => ApiResponse|Promise<ApiResponse>} func 
 * @returns {import("@azure/functions").AzureFunction}
 */
export default function (func)
{
    return async function (context)
    {
        // Normalise inputs
        const req = new AzureFunctionRequest(context);
        let res = new AzureFunctionResponse(context);

        // Run function
        res = func(req, res);

        // Normalise outputs
        return (await Promise.resolve(res)).manufacture();
    };
}

class AzureFunctionRequest extends ApiRequest
{
    /** @type {readonly import("@azure/functions").Context} */
    _context;

    /**
     * @param {import("@azure/functions").Context} context 
     */
    constructor(context)
    {
        super();
        this._context = context;
    }

    get url()
    {
        return this._context.req.url;
    }

    get method()
    {
        return this._context.req.method;
    }

    async body()
    {
        if (this._context.req.rawBody)
        {
            return this._context.req.rawBody;
        }
        else
        {
            throw new Error("Request has no body.");
        }
    }

    async json()
    {
        return JSON.parse(await this.body());
    }
}

class AzureFunctionResponse extends ApiResponse
{
    /** @type {readonly import("@azure/functions").Context} */
    _context;

    /**
     * @param {import("@azure/functions").Context} context 
     */
    constructor(context)
    {
        super();
        this._context = context;
        this.headers.set('Content-Type', 'application/json');
    }

    /**
     * Manufactures a response for Azure Functions.
     * @returns {any}
     */
    manufacture()
    {
        return {
            status: 200,
            body: this.body,
            headers: objectFromEntries(this.headers.entries())
        };
    }
}

/**
 * Converts entries to object. Polyfill for Object.fromEntries
 * @param {IterableIterator<[string, string]>} entries 
 * @returns {object}
 */
function objectFromEntries(entries)
{
    const obj = {};

    for (const entry of entries) {
        obj[entry[0]] = obj[entry[1]];
    }

    return obj;
}

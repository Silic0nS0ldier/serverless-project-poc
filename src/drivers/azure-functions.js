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
        res = await Promise.resolve(func(req, res));

        // Normalise outputs
        return res.manufacture();
    };
}

class AzureFunctionRequest extends ApiRequest
{
    /**
     * @type {import("@azure/functions").Context}
     * @private
     */
    context;

    /**
     * @param {import("@azure/functions").Context} context 
     */
    constructor(context)
    {
        super();
        this.context = context;
    }

    get url()
    {
        if (this.context.req)
            return this.context.req.url;
        return null;
    }

    get method()
    {
        if (this.context.req)
            return this.context.req.method;
        return null;
    }

    async body()
    {
        if (this.context.req && this.context.req.rawBody)
        {
            return this.context.req.rawBody;
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
    /**
     * @type {import("@azure/functions").Context}
     * @private
     */
    context;

    /**
     * @param {import("@azure/functions").Context} context 
     */
    constructor(context)
    {
        super();
        this.context = context;
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
            headers: Object.fromEntries(this.headers.entries())
        };
    }
}

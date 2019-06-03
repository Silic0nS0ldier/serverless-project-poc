/** @tscheck */

/**
 * @abstract
 */
export class ApiRequest
{
    /** @type {readonly string} */
    url;

    /** @type {readonly ("GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT" | "OPTIONS" | "TRACE" | "CONNECT")} */
    method;

    /**
     * @returns {Promise<any>}
     * @virtual
     */
    body()
    {
        notImplemented();
    }

    /** @type {ReadonlyMap<string, string>} */
    headers;

    /**
     * @returns {Promise<any>}
     * @virtual
     */
    json()
    {
        notImplemented();
    }
}

/**
 * @abstract
 */
export class ApiResponse
{
    /** @type {any} */
    body;

    /** @type {ReadonlyMap<string, string>} */
    headers = new Map();
}

function notImplemented()
{
    throw new Error("Not implemented.");
}

/** @tscheck */

/**
 * @abstract
 */
export class ApiRequest
{
    /** @type {string|null} */
    url = null;

    /** @type {"GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT" | "OPTIONS" | "TRACE" | "CONNECT" | null} */
    method = null;

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

    /** @type {Map<string, string>} */
    headers = new Map();
}

function notImplemented()
{
    throw new Error("Not implemented.");
}

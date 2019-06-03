/**
 * @param {import("../drivers/core").ApiRequest} req
 * @param {import("../drivers/core").ApiResponse} res
 */
export default function (req, res)
{
    res.body = "Hello, world!";

    return res;
}
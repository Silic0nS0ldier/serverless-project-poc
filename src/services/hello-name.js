/**
 * @param {import("../drivers/core").ApiRequest} req
 * @param {import("../drivers/core").ApiResponse} res
 */
export default async function (req, res)
{
    const name = await req.json();

    res.body = `Hello, ${name}`;

    return res;
}
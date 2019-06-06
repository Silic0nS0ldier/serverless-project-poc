import fs from "fs";
import babel from "rollup-plugin-babel";
import del from "del";
import nodeResolve from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";

export default async function ()
{
    // Clear out old artefacts, add delay to allow OS chance to catch up
    await del("./artefacts/**");
    await new Promise(function (resolve)
    {
        setTimeout(resolve, 50);
    });

    fs.mkdirSync("./artefacts/dist/", {
        recursive: true
    });
    fs.mkdirSync("./artefacts/gen/azure-functions/", {
        recursive: true
    });

    const servicePaths = fs.readdirSync("./src/services");

    /** @type {import("rollup").RollupOptions[]} */
    const configs = [];

    servicePaths.forEach(servicePath => {
        const glueFile =
`// This file is automatically generated during build
import func from "../../../src/services/${servicePath}";
import driver from "../../../src/drivers/azure-functions.js";

export default driver(func);`;

        const gluePath = "./artefacts/gen/azure-functions/" + servicePath;

        fs.writeFileSync(gluePath, glueFile, {
            flag: "w",
        });
        
        configs.push({
            input: gluePath,
            output: {
                file: "./artefacts/dist/" + servicePath,
                format: "cjs",
                preferConst: true,
            },
            plugins: [
                babel({
                    exclude: "node_modules/**",
                }),
                nodeResolve(),
                cjs(),
            ]
        });
    });

    return configs;
}

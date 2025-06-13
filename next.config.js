/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
module.exports = {
    experimental: {
        optimizeCss: false, // disables LightningCSS for CSS
    },
}

/** @type {import("next").NextConfig} */
const config = {};

export default config;

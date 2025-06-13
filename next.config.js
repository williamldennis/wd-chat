// next.config.js (with ESM)
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import('next').NextConfig} */
const config = {
    experimental: {
        optimizeCss: false, // disables LightningCSS for CSS
    },
};

export default config;

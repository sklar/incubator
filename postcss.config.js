/**
 * PostCSS config.
 * @see https://github.com/postcss/postcss
 * @see https://github.com/michael-ciniawsky/postcss-load-config
 */

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = ({ env }) => ({
    plugins: {
        autoprefixer: {
            grid: false,
        },
        cssnano: env === 'production' ? {} : false,
    },
});

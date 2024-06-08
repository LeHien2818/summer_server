'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('export-pdf')
      .service('myService')
      .getWelcomeMessage();
  },
});

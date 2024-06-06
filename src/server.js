/* eslint-disable */

const Hapi = require('@hapi/hapi');
const routes = require('../routes/leader.routes');
const Inert = require('@hapi/inert');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

    await server.register(Inert);

    server.route(routes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

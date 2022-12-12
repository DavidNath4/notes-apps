const Hapi = require('@hapi/hapi');
const routes = require('./src/routes');

const init = async () => {
    const server = Hapi.server({
        port: 5001,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server runs at ${server.info.uri}`);
};

init();
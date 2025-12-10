export default () => ({
    graphql: {
        enabled: true,
        config: {
            endpoint: '/graphql',
            shadowCRUD: true,
            playgroundAlways: true, // Enable GraphQL Playground in all environments
            depthLimit: 10,
            amountLimit: 100,
            apolloServer: {
                tracing: false,
                introspection: true, // Enable for development
            },
        },
    },
});

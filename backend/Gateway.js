import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';

// Configure the gateway
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'patient', url: 'http://localhost:4002/graphql' },
      { name: 'nurse', url: 'http://localhost:4001/graphql' }
    ],
    pollIntervalInMs: 30000 // Check for updates every 30 seconds
  })
});

// Create Apollo Server instance
const server = new ApolloServer({ gateway });

// Start the server on a different port if 4000 is in use
const startServer = async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 } // Try 4000 first
    });
    console.log(`🚀 Gateway ready at ${url}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      // Fallback to alternative port
      const { url } = await startStandaloneServer(server, {
        listen: { port: 4003 } // Alternative port
      });
      console.log(`🚀 Gateway ready at ${url} (using alternative port)`);
    } else {
      console.error('Failed to start gateway:', error);
      process.exit(1);
    }
  }
};

startServer();
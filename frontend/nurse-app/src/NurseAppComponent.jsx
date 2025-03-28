import React from "react";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

const NurseAppComponent = ({ user, apolloClient }) => {
  return (
    <ApolloProvider client={apolloClient}>
      <App user={user} />
    </ApolloProvider>
  );
};

export default NurseAppComponent;

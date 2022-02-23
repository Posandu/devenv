import React from "react";
import Header from "../components/Header";
import { useUser } from "@auth0/nextjs-auth0";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

function Home() {
  return (
    <>
      <Header></Header>
      <h1>Home</h1>
    </>
  );
}
export default Home;

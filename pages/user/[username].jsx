import { useRouter } from "next/router";
import ErrorPage from "next/error";

import { useState, useEffect } from "react";

import NavigationBar from "../../components/NavigationBar";
import { getDb } from "../../middlewares/database";

import { extractUser } from "../../lib/api-helpers";

const User = (props) => {
  const router = useRouter();

  return (
    <>
      <NavigationBar />
      {props.user ? (
        <div className="page page-centered">
          <div className="page-container">
            <h2>{props.user.name}</h2>
          </div>
        </div>
      ) : (
        <ErrorPage statusCode={404} />
      )}
    </>
  );
};

//SERVER
//------

export const getServerSideProps = async (context) => {
  const db = await getDb();
  const userRes = await db
    .collection("users")
    .findOne({ username: context.params.username });

  if (!userRes) {
    console.log(userRes);
    return {
      props: { user: null },
    };
  }
  return {
    props: {
      user: extractUser({ user: userRes }),
    },
  };
};

export default User;

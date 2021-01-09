import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";

import { useCurrentUser } from "../hooks/user";

const NavigationBar = () => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Navbar.Brand>
        <FontAwesomeIcon className="mr-2" icon={faFingerprint} />
        Find a Dev
      </Navbar.Brand>
      <Nav>
        <Navbar.Text className="mr-2">
          <Link href="/">Home</Link>
        </Navbar.Text>
        <Navbar.Text className="mr-2">
          <Link href="/dashboard">Dashboard</Link>
        </Navbar.Text>
      </Nav>
      <Navbar.Toggle />

      <Navbar.Collapse className="justify-content-end">
        {user ? (
          <>
            <Button
              className="mr-2"
              variant="warning"
              onClick={() => router.replace("/newjob")}
            >
              New Job
            </Button>
            <Navbar.Text className="mr-2">
              Signed in as: <Link href="/account">{user.username}</Link>
            </Navbar.Text>
          </>
        ) : (
          <>
            <Navbar.Text className="mr-2">
              <Link href="/login">Login</Link>
            </Navbar.Text>
            <Navbar.Text className="mr-2">
              <Link href="/signup">Signup</Link>
            </Navbar.Text>
          </>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;

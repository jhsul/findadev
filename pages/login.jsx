import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useCurrentUser } from "../hooks/user";
import NavigationBar from "../components/NavigationBar";

const Login = () => {
  const router = useRouter();
  const [state, setState] = useState({});
  const [user, { mutate }] = useCurrentUser();

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  const handleSubmit = async () => {
    const body = state;
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 200) {
      const userObj = await res.json();
      mutate(userObj);
      router.replace("/");
    } else {
      setState({ ...state, errorMsg: await res.text() });
    }
  };
  return (
    <>
      <NavigationBar />
      <div className="page">
        <div className="form-container">
          <div className="form">
            <h3>Log In</h3>
            {state.errorMsg && <Alert variant="danger">{state.errorMsg}</Alert>}
            <Form>
              <Form.Group controlId="email">
                <Form.Control
                  type="text"
                  placeholder="Username or Email"
                  onChange={(e) =>
                    setState({ ...state, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setState({ ...state, password: e.target.value })
                  }
                />
              </Form.Group>
              <Button onClick={handleSubmit}>Log In</Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

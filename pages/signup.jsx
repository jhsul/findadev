import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import { useCurrentUser } from "../hooks/user";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import NavigationBar from "../components/NavigationBar";

const Signup = () => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();
  const [state, setState] = useState({});

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  const handleSubmit = async () => {
    console.log(state);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });

    if (res.status === 201) {
      const userObj = await res.json();
      mutate(userObj);
    } else {
      const { errorMsg } = await res.json();
      setState({ ...state, errorMsg });
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="page">
        <div className="form-container">
          <div className="form">
            <h3>Create an Account</h3>
            {state.errorMsg && <Alert variant="danger">{state.errorMsg}</Alert>}
            <Form>
              <Form.Group controlId="name">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="username">
                <Form.Control
                  type="username"
                  placeholder="Username"
                  onChange={(e) =>
                    setState({ ...state, username: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Control
                  type="email"
                  placeholder="Email"
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
              <Form.Group controlId="confirmPass">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) =>
                    setState({ ...state, confirmPass: e.target.value })
                  }
                />
              </Form.Group>
              <Button onClick={handleSubmit}>Sign Up</Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;

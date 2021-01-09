import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useRouter } from "next/router";

import { useCurrentUser } from "../hooks/user";
import NavigationBar from "../components/NavigationBar";

const NewJob = () => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();
  const [state, setState] = useState({});

  const handleSubmit = async () => {
    console.log(state);
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });

    if (res.status === 201) {
      const { jobId } = await res.json();
      console.log(jobId);
      router.push("/job/" + jobId);
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
          <div className="form form-lg">
            <h2>Create a Job</h2>
            {state.errorMsg && <Alert variant="danger">{state.errorMsg}</Alert>}
            <Form>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="E-Commerce Website"
                  onChange={(e) =>
                    setState({ ...state, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows={3}
                  placeholder="Tell us exactly what you want and how it works"
                  onChange={(e) =>
                    setState({ ...state, description: e.target.value })
                  }
                />
              </Form.Group>
              <Button onClick={handleSubmit}>Create Job</Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewJob;

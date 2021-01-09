import NavigationBar from "../../components/NavigationBar";

import { useLayoutEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useCurrentUser } from "../../hooks/user";
const Settings = (props) => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();
  const [state, setState] = useState({ user: null });

  useLayoutEffect(() => {
    const getUserObj = async () => {
      const res = await fetch("/api/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const userObj = await res.json();
      setState(userObj);
    };

    if (!user) {
      router.push("/login");
    }
    if (!state.user) {
      getUserObj();
    }
    return;
  });

  const handleSubmit = () => {
    console.log(state);
  };

  return (
    <>
      <NavigationBar />
      {state.user ? (
        <div className="page">
          <div className="form-container">
            <div className="form form-lg">
              {state.errorMsg && (
                <Alert variant="danger">{state.errorMsg}</Alert>
              )}
              <Form>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={state.user.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
                ></Form.Control>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  placeholder={state.user.username}
                ></Form.Control>
              </Form>
              <Button variant="secondary">Cancel</Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
          </div>
        </div>
      ) : (
        <div>hi</div>
      )}
    </>
  );
};

export default Settings;

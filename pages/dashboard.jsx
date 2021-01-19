import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Tab, Tabs } from "react-bootstrap";

import { useCurrentUser } from "../hooks/user";
import NavigationBar from "../components/NavigationBar";
const Dashboard = (props) => {
  const [user, { mutate }] = useCurrentUser();
  const router = useRouter();
  const [state, setState] = useState({});

  useEffect(async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const res = await fetch(`/api/user/${user.username}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (res.status !== 201) {
      router.push("/404");
    }

    const userRes = await res.json();

    setState(userRes);
  }, []);
  return (
    <>
      <NavigationBar />
      <div className="page page-centered">
        <div className="job-page">
          <h3>Hello, {user ? user.name : "WHO ARE YOU!!"}</h3>
          <Tabs defaultActiveKey="jobs" id="dashboard-tabs">
            <Tab eventKey="jobs" title="Your Jobs">
              {JSON.stringify(state)}
            </Tab>
            <Tab eventKey="bids" title="Your Bids"></Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

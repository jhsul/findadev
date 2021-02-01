import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Tab, Tabs } from "react-bootstrap";

import { useCurrentUser } from "../hooks/user";
import NavigationBar from "../components/NavigationBar";
import JobPreviewFromID from "../components/JobPreviewFromID";
import BidPreview from "../components/BidPreview";
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
        <div className="job-list">
          {state.user ? (
            <>
              <h3>Hello, {state.user.name}</h3>
              <Tabs defaultActiveKey="jobs" id="dashboard-tabs">
                <Tab eventKey="jobs" title="Your Jobs">
                  {state.user.ownedJobs.map((jobId) => (
                    <JobPreviewFromID jobId={jobId} />
                  ))}
                </Tab>
                <Tab eventKey="bids" title="Your Bids">
                  {state.user.bids.map((bidId) => (
                    <BidPreview bidId={bidId} />
                  ))}
                </Tab>
              </Tabs>
            </>
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

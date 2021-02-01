import { useRouter } from "next/router";
import { ObjectId } from "mongodb";

import NavigationBar from "../../../components/NavigationBar";

import { getDb } from "../../../middlewares/database";
import { useCurrentUser, useUser } from "../../../hooks/user";
import UserPreview from "../../../components/UserPreview";
import BidPreview from "../../../components/BidPreview";
import Button from "react-bootstrap/Button";
import { Badge, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";

const Job = (props) => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();
  const [state, setState] = useState({});
  const owner = useUser(props.job.owner);
  const { jobId } = router.query;

  const handleBid = () => router.push(`/job/${jobId}/bid`);
  const handleDelete = async () => {
    const res = await fetch(`/api/job/${jobId}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      router.push("/");
    } else {
      console.log("Delete didn't work");
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  });

  const handleSelect = async (e) => {
    console.log(e.target.value);
    const res = await fetch(`/api/job/${jobId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bidId: e.target.value }),
    });

    if (res.status !== 204) {
      console.log("we didnt do it joe");
      const { errorMsg } = await res.json();
      setState({ ...state, errorMsg });
      return;
    } else {
      console.log("WE DID IT JOE");
      router.push("/dashboard");
    }
  };

  return user ? (
    <>
      <NavigationBar />

      <div className="page page-centered">
        <div className="job-list">
          <div>
            {props.job.status === "open" && (
              <Badge variant="success">Open</Badge>
            )}
            <h3>{props.job.title}</h3>
            <p>{props.job.description}3</p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <UserPreview username={props.job.owner} />
            {user.username === props.job.owner ? (
              <Button variant="danger" className="ml-2" onClick={handleDelete}>
                Delete
              </Button>
            ) : (
              <Button variant="primary" className="ml-2" onClick={handleBid}>
                Bid
              </Button>
            )}
          </div>
          {user.username === props.job.owner && (
            <>
              <h3 className="mt-2">Bids</h3>
              {props.job.bids.map((bidId) => (
                <div className="bid-selection">
                  <div>
                    <BidPreview
                      bidId={bidId}
                      acceptButton={
                        <Button
                          className="mt-2"
                          variant="success"
                          value={bidId}
                          onClick={handleSelect}
                        >
                          Accept
                        </Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  ) : (
    <div>Loading current user</div>
  );

  /*
  return (
    <>
      <NavigationBar />
      <div className="page page-centered">
        <div className="job-list">
          {state.errorMsg && <Alert variant="danger">{state.errorMsg}</Alert>}
          <UserPreview username={props.job.owner} />
          {props.job.status === "open" && <Badge variant="success">Open</Badge>}
          {props.job.status === "closed" && (
            <Badge variant="primary">Closed</Badge>
          )}
          <h3>{props.job.title}</h3>
          <p>{props.job.description}</p>
          {!user || user.username === props.job.owner ? (
            <>
              <h3>Bids</h3>
              {props.job.bids.map((bidId) => (
                <div className="bid-selection">
                  <BidPreview bidId={bidId} />
                  <Button
                    className="mt-2"
                    variant="success"
                    value={bidId}
                    onClick={handleSelect}
                  >
                    Select
                  </Button>
                </div>
              ))}
              <Button variant="danger" className="mt-2" onClick={handleDelete}>
                Delete Job
              </Button>
            </>
          ) : (
            <Button variant="success" onClick={handleBid}>
              Bid
            </Button>
          )}
        </div>
      </div>
    </>
  );*/
};

export const getServerSideProps = async (context) => {
  const db = await getDb();
  const _id = ObjectId(context.query.jobId);
  if (!_id) {
    return { notFound: true };
  }
  const jobRes = await db
    .collection("jobs")
    .findOne({ _id: ObjectId(context.query.jobId) });

  if (!jobRes) {
    return { notFound: true };
  }
  return {
    props: {
      job: {
        ...jobRes,
        _id: jobRes._id.toHexString(),
        bids: jobRes.bids.map((bidId) => bidId.toHexString()),
      },
    },
  };
};

export default Job;

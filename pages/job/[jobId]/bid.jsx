import NavigationBar from "../../../components/NavigationBar";

import { useRouter } from "next/router";
import { useState } from "react";
import { getDb } from "../../../middlewares/database";
import { ObjectId } from "mongodb";

import Form from "react-bootstrap/Form";

import { InputGroup, Button, Alert } from "react-bootstrap";

const Bid = (props) => {
  const router = useRouter();
  const [state, setState] = useState({});
  const { jobId } = router.query;
  const handleSubmit = async () => {
    const res = await fetch("/api/bids", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...state, jobId }),
    });

    if (res.status === 204) {
      console.log("we did it joe");
      router.push("/dashboard");
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
            <h2>{props.job.title}</h2>
            <p>{props.job.description}</p>
            {state.errorMsg && <Alert variant="danger">{state.errorMsg}</Alert>}
            <Form>
              <Form.Group controlId="how">
                <Form.Label>
                  <h3>How will you do this job?</h3>
                  <p>Be specific!</p>
                </Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows={3}
                  placeholder="I will write a webapp with nextjs and host on vercel."
                  onChange={(e) => setState({ ...state, how: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="why">
                <Form.Label>
                  <h3>Why are you the best candidate?</h3>
                  <p>What puts you apart from every other bidder?</p>
                </Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows={3}
                  placeholder="Include links to previous work!"
                  onChange={(e) => setState({ ...state, why: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="price">
                <Form.Label>
                  <h3>What's your offer?</h3>
                  <p>Put a price tag on your bid!</p>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>$</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    type="text"
                    required
                    placeholder="100"
                    onChange={(e) =>
                      setState({ ...state, price: e.target.value })
                    }
                  />
                </InputGroup>
              </Form.Group>
              <Button onClick={handleSubmit}>Submit Bid</Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const db = await getDb();
  const _id = ObjectId(context.query.jobId);
  if (!_id) {
    return { notFound: true };
  }
  const jobRes = await db.collection("jobs").findOne({ _id });
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

export default Bid;

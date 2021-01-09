import { useRouter } from "next/router";
import { ObjectId } from "mongodb";

import NavigationBar from "../../../components/NavigationBar";

import { getDb } from "../../../middlewares/database";
import { useCurrentUser, useUser } from "../../../hooks/user";
import UserPreview from "../../../components/UserPreview";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";

const Job = (props) => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();
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

  return (
    <>
      <NavigationBar />
      <div className="page page-centered">
        <div className="job-page">
          <UserPreview username={props.job.owner} />
          <h3>{props.job.title}</h3>
          <p>{props.job.description}</p>
          {!user || user.username === props.job.owner ? (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          ) : (
            <Button variant="success" onClick={handleBid}>
              Bid
            </Button>
          )}
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
  const jobRes = await db
    .collection("jobs")
    .findOne({ _id: ObjectId(context.query.jobId) });

  if (!jobRes) {
    return { notFound: true };
  }
  return { props: { job: { ...jobRes, _id: jobRes._id.toHexString() } } };
};

export default Job;

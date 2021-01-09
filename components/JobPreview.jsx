import { useUser, useCurrentUser } from "../hooks/user";
import UserPreview from "./UserPreview";
import { useRouter } from "next/router";
import Link from "next/link";
const JobPreview = (props) => {
  if (!props.job) {
    return <div>Nothing to see here</div>;
  }

  const router = useRouter();

  const owner = useUser(props.job.owner);
  const handleClick = () => {
    router.push(`/job/${props.job._id}`);
  };

  return (
    <div className="job-preview" onClick={handleClick}>
      <h3>{props.job.title}</h3>
      <p>{props.job.description}</p>
      <UserPreview username={props.job.owner} />
    </div>
  );
};

export default JobPreview;
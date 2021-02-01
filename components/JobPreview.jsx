import UserPreview from "./UserPreview";
import { useRouter } from "next/router";
import { Badge, Accordion, Card } from "react-bootstrap";
import Link from "next/link";
const JobPreview = (props) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/job/${props.job._id}`);
  };

  return (
    <Accordion className="mt-2 ">
      <Card>
        <Accordion.Toggle
          as={Card.Header}
          eventKey="0"
          style={{ cursor: "pointer" }}
        >
          {props.job.status === "open" && <Badge variant="success">Open</Badge>}
          {props.job.status === "closed" && (
            <Badge variant="primary">Closed</Badge>
          )}
          <h4>{props.job.title}</h4>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body style={{ cursor: "pointer" }} onClick={handleClick}>
            <UserPreview username={props.job.owner} />
            <div className="mt-2">{props.job.description}</div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
  /*
  return (
    <div className="job-preview" onClick={handleClick}>
      <h3>{props.job.title}</h3>
      <p>{props.job.description}</p>
      {props.job.status === "open" && <Badge variant="success">Open</Badge>}
      {props.job.status === "closed" && <Badge variant="primary">Closed</Badge>}
      <UserPreview username={props.job.owner} />
    </div>
  );
  */
};

export default JobPreview;

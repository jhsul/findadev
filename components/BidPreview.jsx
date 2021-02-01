import { useBid } from "../hooks/bid";
import { useJob } from "../hooks/job";
import UserPreview from "./UserPreview";

import { Accordion, Card, Button, Badge } from "react-bootstrap";
import Link from "next/link";

const BidPreview = ({ bidId, acceptButton }) => {
  const bid = useBid(bidId);

  return bid ? (
    <div>
      <Accordion className="mt-2">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            <h4 style={{ cursor: "pointer" }}>
              {bid.jobId} - {bid.bidder}
            </h4>
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <UserPreview username={bid.bidder} />
              <div className="mt-2">
                {bid.status === "waiting" && (
                  <Badge variant="primary">Waiting</Badge>
                )}
                {bid.status === "expired" && (
                  <Badge variant="danger">Expired</Badge>
                )}
                {bid.status === "active" && (
                  <Badge variant="success">Active</Badge>
                )}
                <h4>How</h4>
                <p>{bid.how}</p>
                <h4>Why</h4>
                <p>{bid.why}</p>
                <h4>Price</h4>
                <p>${bid.price}</p>
                {acceptButton}
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  ) : (
    <div>Loading Bid Preview</div>
  );
};

export default BidPreview;

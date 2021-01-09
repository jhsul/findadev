import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
const LandingPage = () => {
  const wordList = ["Dev", "Data Analyst", "Graphic Designer"];
  const router = useRouter();
  const [state, setState] = useState({
    charIdx: 1,
    wordIdx: 0,
    inc: 1,
    text: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState((state) => {
        return {
          wordIdx:
            state.charIdx === 0
              ? (state.wordIdx + 1) % wordList.length
              : state.wordIdx,
          charIdx: state.charIdx + state.inc,
          inc:
            state.charIdx === wordList[state.wordIdx].length + 5
              ? -1
              : state.charIdx === 1
              ? 1
              : state.inc,
          text: wordList[state.wordIdx].substring(0, state.charIdx),
        };
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      <h1>Find a {state.text}</h1>
      <p>Get started today with as low as $5</p>
      <div>
        <Button variant="outline-primary" onClick={() => router.push("/about")}>
          Learn More
        </Button>{" "}
        <Button onClick={() => router.push("/signup")}>Sign Up</Button>
      </div>
    </div>
  );
};

export default LandingPage;

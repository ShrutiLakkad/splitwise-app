import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

export default function Dashboard() {
  const [group, setGroup] = useState<string>("");
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [isGroupNameValid, setGroupNameValid] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Validate the group name input
    if (!group) {
      setGroupNameValid(false);
      return;
    }
    localStorage.setItem("group", group);
    navigate("/settle-up");
  };

  const renderGroupForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formText">
          <Form.Label as={"h1"} className="text-success">
            Group
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter group name"
            onChange={(e) => {
              setGroup(e.target.value);
              setGroupNameValid(true);
            }}
            isInvalid={!isGroupNameValid}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a group name.
          </Form.Control.Feedback>
        </Form.Group>
        <br />
        <Button variant="success" type="submit">
          Submit
        </Button>
      </Form>
    );
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        {showGroupForm ? (
          renderGroupForm()
        ) : (
          <>
            <h1>Welcome to SplitWise App</h1>
            <Button variant="success" onClick={() => setShowGroupForm(true)}>
              Get Started
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

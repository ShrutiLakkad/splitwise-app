import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Navbar,
  Row,
} from "react-bootstrap";
import { IconBack } from "../../../assets/icon/icons";

type Expense = {
  payer: string;
  amount: number;
};

type Balance = {
  member: string;
  balance: number;
};

const SplitWiseApp: React.FC = () => {
  const [group, setGroup] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payer, setPayer] = useState<string>("");
  const [selectedPayer, setSelectedPayer] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Load group data from local storage on initial render
    const groupData = localStorage.getItem("group");
    const membersData = localStorage.getItem("members");
    const expensesData = localStorage.getItem("expenses");

    if (groupData) {
      setGroup(groupData);
    }

    if (membersData) {
      setMembers(JSON.parse(membersData));
    }

    if (expensesData) {
      setExpenses(JSON.parse(expensesData));
    }
  }, []);

  useEffect(() => {
    // Save group data to local storage when it changes
    localStorage.setItem("group", group);
  }, [group]);

  useEffect(() => {
    // Save members data to local storage when it changes
    localStorage.setItem("members", JSON.stringify(members));

    if (!selectedPayer && members.length > 0) {
      setSelectedPayer(members[0]);
    }
  }, [members]);

  useEffect(() => {
    // Save expenses data to local storage when it changes
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    // Calculate balances when expenses or members change
    const totals: { [payer: string]: number } = {};
    expenses.forEach((expense) => {
      if (totals[expense.payer]) {
        totals[expense.payer] += expense.amount;
      } else {
        totals[expense.payer] = expense.amount;
      }
    });

    const numMembers = members.length;
    const averageExpense =
      Object.values(totals).reduce((sum, amount) => sum + amount, 0) /
      numMembers;

    const newBalances: Balance[] = members.map((member) => {
      const memberExpense = totals[member] || 0;
      const balance = memberExpense - averageExpense;
      return { member, balance };
    });

    setBalances(newBalances);
  }, [expenses, members]);


  const handleAddMember = () => {
    if (!payer) {
      setShowValidation(true);
      return;
    }

    if (members.includes(payer)) {
      setShowValidation(false);
      alert('Member already exists!');
      return;
    }

    setShowValidation(false);
    setMembers([...members, payer]);
    setPayer('');
  };

  const handleAddExpense = () => {
    const newExpense: Expense = { payer: selectedPayer, amount };
    setExpenses([...expenses, newExpense]);
    // setPayer("");
    setAmount(0);
  }

  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        className="d-flex justify-content-between align-items-center header"
      >
        <div className="back-icon" onClick={() => navigate("/")}>
          <IconBack color="white" />
        </div>
        <Navbar.Brand as={"h1"} className="group-heading">
          Group : {group}
        </Navbar.Brand>
        <span></span>
      </Navbar>
      <Container fluid>
        <Row>
          <Col md="4" sm="12" className="mb-4">
            <Card>
              <Card.Body>
                <Form className="full-width mb-4">
                  <Card.Title>Members</Card.Title>
                  <ul>
                    {members.map((member) => (
                      <li key={member}>{member}</li>
                    ))}
                  </ul>
                  <Form.Label className="full-width mb-4">
                    Member Name:
                    <Form.Control
                      type="text"
                      className="mt-2"
                      value={payer}
                      required
                      // onChange={(e) => setPayer(e.target.value)}
                      onChange={(e) => setPayer(e.target.value)}
                      isInvalid={showValidation && !payer}
                    />
                    {showValidation && !payer && (
                      <Form.Control.Feedback type="invalid">
                        Please enter a member name.
                      </Form.Control.Feedback>
                    )}
                  </Form.Label>
                  <Button variant="success" onClick={handleAddMember}>
                    Add Member
                  </Button>
                  <br />
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4" sm="12" className="mb-4">
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Summary</Card.Title>
                <Card.Text>Number of People: {members.length}</Card.Text>
                <Card.Text>
                  {" "}
                  Total Products Value:{" "}
                  {expenses
                    .reduce((sum, expense) => sum + expense.amount, 0)
                    .toFixed(2)}
                </Card.Text>
                <Card.Text>
                  Cost per Person:{" "}
                  {(members.length > 0
                    ? expenses.reduce(
                      (sum, expense) => sum + expense.amount,
                      0
                    ) / members.length
                    : 0
                  ).toFixed(2)}
                </Card.Text>
              </Card.Body>
            </Card>
            {balances.length > 0 && (
              <Card>
                <Card.Body>
                  <Card.Title>Balance Details</Card.Title>
                  <ul>
                    {balances.map((balance, index) => (
                      <li key={index}>
                        {balance.balance > 0 ? (
                          <span className="text-success">
                            {`${balance.member
                              } has to receive ${balance.balance.toFixed(
                                2
                              )} ₹ in total`}
                          </span>
                        ) : (
                          <span className="text-danger">
                            {`${balance.member} has to give ${Math.abs(
                              balance.balance
                            ).toFixed(2)} ₹ in total`}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col md="4" sm="12" className="mb-4">
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Add Expenses</Card.Title>
                {members.length > 0 ? (
                  <div className="amount-container">
                    <div className="payer-dropdown">
                      <Form className="d-flex align-items-center">
                        <Form.Label className="mr-1 mb-0"> Payer:</Form.Label>
                        <Form.Select
                          onChange={(e) => setSelectedPayer(e.target.value)}
                        >
                          {members.map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </Form.Select>
                      </Form>
                    </div>
                    <div className="amount-input">
                      <Form>
                        <Form.Label>
                          Amount:
                          <Form.Control
                            type="number"
                            value={amount}
                            required
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="amount"
                          />
                          {showValidation && !payer && (
                            <Form.Control.Feedback type="invalid">
                              Please enter a member name.
                            </Form.Control.Feedback>
                          )}
                        </Form.Label>
                      </Form>
                    </div>
                    <Button variant="success" onClick={handleAddExpense}>
                      Add Expense
                    </Button>
                  </div>
                ) : (
                  <Card.Text> Please add members first.</Card.Text>
                )}
              </Card.Body>
            </Card>
            {expenses.length > 0 && (
              <Card>
                <Card.Body>
                  <Card.Title>Expenses</Card.Title>
                  <table>
                    <thead>
                      <tr>
                        <th>Payer</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenses.map((expense, index) => (
                        <tr key={index}>
                          <td>{expense.payer}</td>
                          <td>{expense.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SplitWiseApp;

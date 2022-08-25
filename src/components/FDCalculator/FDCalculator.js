import React from 'react';
import PropTypes from 'prop-types';
import styles from './FDCalculator.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Col, Container, Row } from 'react-bootstrap';
import {useState} from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';

const FDCalculator = () => {

  const amount = React.useRef(null);
  const roi = React.useRef(null);
  const years = React.useRef(null);
  const months = React.useRef(null);
  const days = React.useRef(null);
  const dod = React.useRef(null);
  const [typeOfDeposit, setTypeOfDeposit] = useState("Reinvestment");

  const [investedAmount, setInvestedAmount] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [displayResult, setDisplayResult] = useState(false);

  const [interestTable, setInterestTable] = useState([]);

  const handleSubmit = event => {
    event.preventDefault();

    setInterestTable([]);

    let interestCalculated = calculateInterest();

    setInvestedAmount(interestCalculated.investedAmount);
    setInterestAmount(interestCalculated.interestAmount);
    setTotalAmount(interestCalculated.totalAmount);

    setDisplayResult(true);

  };

  const handleReset = event => {
    setDisplayResult(false);
  }

  function isLeapYear(year){
    if(year % 400 === 0)
      return true;

    if(year % 100 === 0)
      return false;

    if(year % 4 === 0)
      return true;

    return false;
  }

  function calculateNextQuarter(date){
    const idate = new Date(date);
    const currentYear = idate.getFullYear();
    const janQ = new Date(currentYear + "-01-01");
    const aprQ = new Date(currentYear + "-04-01");
    const julQ = new Date(currentYear + "-07-01");
    const octQ = new Date(currentYear + "-10-01");
    const nextJanQ = new Date((currentYear+1) + "-01-01");

    if(idate < janQ)
      return janQ;
    else if(idate < aprQ)
      return aprQ;
    else if(idate < julQ)
      return julQ;
    else if(idate < octQ)
      return octQ;
    else if(idate < nextJanQ)
      return nextJanQ;
  }

  function calculateNextQuarterReinvestment(date){
    const idate = new Date(date);
    const nextQuarterDate = new Date(idate.setMonth(idate.getMonth()+3));
    return nextQuarterDate;
  }
  

  function calculateInterest() {

    setInterestTable([]);

    let xamount = parseFloat(amount.current.value);
    let xroi = parseFloat(roi.current.value);
    let xyears = parseInt(years.current.value);
    let xmonths = parseInt(months.current.value);
    let xdays = parseInt(days.current.value);
    let xdod = dod.current.value;

    console.log("Type of Deposit : " + typeOfDeposit);

    const dom = new Date(xdod);
    dom.setFullYear(dom.getFullYear() + xyears);
    dom.setMonth(dom.getMonth() + xmonths);
    dom.setDate(dom.getDate() + xdays);

    console.log("Date of Maturity : " + dom.toDateString());

    let output = {
      investedAmount : 0,
      interestAmount : 0,
      totalAmount : 0
    };

    if(typeOfDeposit === 'Reinvestment'){

      let currentDate = new Date(xdod);

      let currentAmount = parseFloat(xamount);

      while(currentDate < dom){
        console.log("Current Date : " + currentDate.toDateString());
        let currentYear = currentDate.getFullYear();
        let yearlyInterest = currentAmount * xroi * 0.01;
        console.log("Yearly Interest : " + yearlyInterest);
        let perDayInterest = (currentAmount * xroi * 0.01)/(isLeapYear(currentYear)?366:365);
        console.log("Per Day Interest : " + perDayInterest);
        let nextQuarterDate = calculateNextQuarterReinvestment(currentDate);
        let remainingNoOfDays = 0;
        if(nextQuarterDate > dom){
          nextQuarterDate = dom;
          remainingNoOfDays = Math.ceil(Math.abs(nextQuarterDate - currentDate)/(1000 * 60 * 60 * 24));
          console.log("Number of Days : " + remainingNoOfDays);
        }
        console.log("Next Quarter Date : " + nextQuarterDate.toDateString());
        
        let interest = yearlyInterest * 0.25;
        if(remainingNoOfDays != 0){
          interest = remainingNoOfDays * perDayInterest;
        }
        interest = interest.toFixed(2);
        console.log("Interest : " + interest);
        currentAmount = currentAmount + parseFloat(interest);
        console.log("Current Amount : " + currentAmount);
        let interestTableEntry = {
          date : nextQuarterDate.toDateString(),
          interestAmount : interest,
          totalAmount : currentAmount
        }
        interestTable.push(interestTableEntry);
        setInterestTable(interestTable);
        currentDate = nextQuarterDate;
      }

      output.totalAmount = currentAmount;
      output.interestAmount = currentAmount - xamount;
      output.investedAmount = xamount;

      console.log("Interest Table : " + JSON.stringify(interestTable));

      console.log(output);
    }
    return output;
  }

  const Results = () => (
    <div > 
      <h1 >Invested Amount : {investedAmount}</h1>
      <h1 >Interest Amount : {interestAmount}</h1>
      <h1 >Total Amount : {totalAmount}</h1>
    </div>
  )

  const ResultTable = () => (
    <Container>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Interest Amount</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {interestTable.map((element) => (
              <tr>
                <td></td>
                <td>{element.date}</td>
                <td>{element.interestAmount}</td>
                <td>{element.totalAmount}</td>
            </tr>
            ))}
          </tbody>
        </Table>
      </Container>
  )

  return (
    <div className={styles.FDCalculator}>
      <Container>
        <Form className='fdform' onSubmit={handleSubmit}>
          <Form.Group className="mb-3">          
            <InputGroup className="mb-3">
              <InputGroup.Text>Total Amount</InputGroup.Text>
                <Form.Control size="lg" type="number" required="required" ref={amount} autoComplete='off' />           
              <InputGroup.Text>₹</InputGroup.Text>
            </InputGroup>          
          </Form.Group>

          <Form.Group className="mb-3"> 
            <InputGroup className="mb-3">
              <InputGroup.Text>Rate of Interest</InputGroup.Text>
                <Form.Control size="lg" type="float" required="required" ref={roi} min={0} max={15} autoComplete='off' />
              <InputGroup.Text>% Per Annum</InputGroup.Text>
            </InputGroup> 
          </Form.Group>
          <Form.Group className="mb-3"> 
            <InputGroup className="mb-3">
              <InputGroup.Text>Type of Deposit</InputGroup.Text>
              <InputGroup.Text onClick={e => (setTypeOfDeposit("Reinvestment"))}>
                <Form.Check inline label="Reinvestment" defaultChecked name="typeOfDeposit" type='radio'/>
              </InputGroup.Text>
              <InputGroup.Text onClick={e => (setTypeOfDeposit("QuarterlyPayout"))}>
                <Form.Check inline label="Quarterly Payout" name="typeOfDeposit" type='radio'/>
              </InputGroup.Text>
              <InputGroup.Text onClick={e => (setTypeOfDeposit("MonthlyPayout"))}>
                <Form.Check inline label="Monthly Payout" name="typeOfDeposit" type='radio'/>
              </InputGroup.Text>
              <InputGroup.Text onClick={e => (setTypeOfDeposit("ShortTerm"))}>
                <Form.Check inline label="Short Term" name="typeOfDeposit" type='radio'/>
              </InputGroup.Text>
            </InputGroup> 
          </Form.Group>
          <Form.Group className="mb-3">
            <InputGroup className="mb-3">
              <InputGroup.Text>Time Period</InputGroup.Text>
                <Form.Control size="lg" type="number" defaultValue={0} ref={years} min={0} max={10} autoComplete='off' />
                  <InputGroup.Text>Years</InputGroup.Text>
                <Form.Control size="lg" type="number" defaultValue={0} ref={months} min={0} max={11} autoComplete='off' />
                  <InputGroup.Text>Months</InputGroup.Text>
                <Form.Control size="lg" type="number" defaultValue={0} ref={days} min={0} max={31} autoComplete='off' />
                  <InputGroup.Text>Days</InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <InputGroup className="mb-3">
              <InputGroup.Text>Date of Deposit</InputGroup.Text>
              <Form.Control type="date" ref={dod} required placeholder="Date of Deposit" autoComplete='off' />
            </InputGroup>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button variant="primary" size="lg" type="submit">
              Calculate Interest
            </Button>
            <Button onClick={handleReset} variant="primary" size="lg" type="reset">
              Reset
            </Button>
          </div>
        </Form>

        { displayResult && <Results/> }
      </Container>
      { displayResult && <ResultTable/> }

    </div>
  )
};

FDCalculator.propTypes = {};

FDCalculator.defaultProps = {};

export default FDCalculator;

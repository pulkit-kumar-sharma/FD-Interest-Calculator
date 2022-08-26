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

    setInterestTable(new Array());
    setDisplayResult(false);

    let interestCalculated = calculateInterest();

    setInvestedAmount(interestCalculated.investedAmount);
    setInterestAmount(interestCalculated.interestAmount);
    setTotalAmount(interestCalculated.totalAmount);

    setDisplayResult(true);

  };

  const handleReset = event => {
    setDisplayResult(false);
    setInterestTable([]);
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

  function calculateNextInterestDepositDate(date){
    const idate = new Date(date);
    idate.setMonth(idate.getMonth()+3);
    idate.setDate(idate.getDate()-1);
    return idate;
  }

  function calculateNextInterestDepositPrintDate(date){
    const idate = new Date(date);
    idate.setDate(idate.getDate+1);
    return idate;
  }

  function calculateMonthEndDate(date){
    
    const thirtydaysMonths = [4,6,9,11];
    const thirtyOnedaysMonths = [1,3,5,7,8,10,12];
    const exceptionalMonth = [2];
    const idate = new Date(date);
    let monthNumber = idate.getMonth() + 1;
    if(thirtydaysMonths.includes(monthNumber)){
      idate.setDate(30);
      return idate;
    }
    else if(thirtyOnedaysMonths.includes(monthNumber)){
      idate.setDate(31);
      return idate;
    }
    else if(exceptionalMonth.includes(monthNumber)){
      if(isLeapYear(idate.getFullYear())){
        idate.setDate(29);
      }
      else{
        idate.setDate(28);
      }
      return idate;
    }
  }

  function getNextDate(date){
    const idate = new Date(date);
    idate.setDate(idate.getDate() + 1);
    return idate;
  }
  

  function calculateInterest() {

    let xamount = parseFloat(amount.current.value);
    let xroi = parseFloat(roi.current.value);
    let xyears = parseInt(years.current.value);
    let xmonths = parseInt(months.current.value);
    let xdays = parseInt(days.current.value);
    let xdod = dod.current.value;

    console.log("Type of Deposit : " + typeOfDeposit);

    const dateOfMaturity = new Date(xdod);
    dateOfMaturity.setFullYear(dateOfMaturity.getFullYear() + xyears);
    dateOfMaturity.setMonth(dateOfMaturity.getMonth() + xmonths);
    dateOfMaturity.setDate(dateOfMaturity.getDate() + xdays);

    console.log("Date of Maturity : " + dateOfMaturity.toDateString());

    let output = {
      investedAmount : 0,
      interestAmount : 0,
      totalAmount : 0
    };

    if(typeOfDeposit === 'Reinvestment'){

      let currentDate = new Date(xdod);
      let lastInterestDepositDate = currentDate;
      let currentAmount = parseFloat(xamount);

      let counter = 1;

      let interestTableEntry = {
        sno : counter,
        date : currentDate.toDateString(),
        interestAmount : 0,
        interestCapitalized : 0,
        totalAmount : currentAmount
      }
      interestTable.push(interestTableEntry);
      setInterestTable(interestTable);

      let date = "2022-05-23";
      console.log(calculateMonthEndDate(date));

      date = "2022-10-30";
      console.log(calculateMonthEndDate(date));

      date = "2022-06-25";
      console.log(calculateMonthEndDate(date));

      let interestAccumulatedButNotCredited = parseFloat(0);
      while(currentDate < dateOfMaturity){
        counter++;
        console.log("Last Deposit Date : " + lastInterestDepositDate.toDateString());
        console.log("Current Date : " + currentDate.toDateString());
        let currentYear = currentDate.getFullYear();
        let yearlyInterest = currentAmount * xroi * 0.01;
        console.log("Yearly Interest : " + yearlyInterest);
        let perDayInterest = (currentAmount * xroi * 0.01)/(isLeapYear(currentYear)?366:365);
        console.log("Per Day Interest : " + perDayInterest);
        let interestCalculationDate = calculateMonthEndDate(currentDate);
        let interestDepositDate = calculateNextInterestDepositDate(lastInterestDepositDate);
        if(interestDepositDate > dateOfMaturity){
          interestDepositDate = dateOfMaturity;
        }
        console.log("Interest Deposit Date : " + interestDepositDate.toDateString());
        let noOfDays = 0;
        let interestCapitalized = 0;
        if(interestCalculationDate > interestDepositDate){
          interestCalculationDate = interestDepositDate;
        }
        console.log("Interest Calculation Date : " + interestCalculationDate.toDateString());

        noOfDays = Math.ceil(Math.abs(interestCalculationDate - currentDate + 1)/(1000 * 60 * 60 * 24));
        // if(interestCalculationDate === interestDepositDate){
        //   noOfDays = Math.ceil(Math.abs(interestCalculationDate - currentDate)/(1000 * 60 * 60 * 24));
        // }
        console.log("Number of Days : " + noOfDays);
        
        let interest = noOfDays * perDayInterest;
        interest = interest.toFixed(2);
        interestAccumulatedButNotCredited += parseFloat(interest);
        console.log("Interest For This Month : " + interest);
        console.log("Interest Accumulated But Not Credited : " + interestAccumulatedButNotCredited);
        
        if(interestCalculationDate === interestDepositDate){
          interestCapitalized = interestAccumulatedButNotCredited.toFixed(0);
          currentAmount = currentAmount + parseFloat(interestCapitalized);
          lastInterestDepositDate = interestDepositDate;
          interestAccumulatedButNotCredited = 0;
        }
        console.log("Current Amount : " + currentAmount);
        let interestTableEntry = {
          sno : counter,
          date : interestCalculationDate.toDateString(),
          interestAmount : interest,
          interestCapitalized : interestCapitalized,
          totalAmount : currentAmount.toFixed(0)
        }
        interestTable.push(interestTableEntry);
        setInterestTable(interestTable);
        currentDate = getNextDate(interestCalculationDate);
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
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Interest Amount</th>
              <th>Interest Capitalized</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {interestTable.map((element) => (
              <tr>
                <td>{element.sno}</td>
                <td>{element.date}</td>
                <td>{element.interestAmount}</td>
                <td>{element.interestCapitalized}</td>
                <td>{element.totalAmount}</td>
            </tr>
            ))}
          </tbody>
        </Table>
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
        { displayResult && <ResultTable/> }
      </Container>
      

    </div>
  )
};

FDCalculator.propTypes = {};

FDCalculator.defaultProps = {};

export default FDCalculator;

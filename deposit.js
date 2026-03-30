function Deposit(){
  const [amount, setAmount]           = React.useState('');
  const [show, setShow]               = React.useState(true);
  const [email, setEmail]             = React.useState('');
  const [isValid, setIsValid]         = React.useState(true);
  const [currentBalance, setCurrentBalance] = React.useState(0);

  function handleSubmit(){ 
    fetch(`/account/update/${email}/${amount}`, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        setCurrentBalance(Number(data.balance) || 0);
        setAmount('');
        setShow(false);
      })
      .catch(error => {
        alert(`Deposit failed: ${error.message}`);
      });
  }

  const handleChange = (event) => {
    const nextAmount = Number(event.target.value);
    setIsValid(!(nextAmount > 0));
    setAmount(event.target.value);
  };

  function clearForm(){
    setAmount('');
    setShow(true);
    setIsValid(true);
  }

  return (
    <Card
      bgcolor="secondary"
      txtcolor="white"
      header="Deposit"
      body={show ? (  
        <>
          Email address<br/>
          <input type="input" className="form-control" id="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.currentTarget.value)}/><br></br>
          Amount   
          <input type="number" className="form-control" id="deposit" placeholder="$0.00" value={amount} onChange={handleChange}/><br/>
          <button type="submit" disabled={isValid || !email} className="btn btn-light" onClick={handleSubmit}>Make deposit</button> 
        </>
      ):(
        <>
          <h5>Success! Your Current Balance: ${currentBalance} USD</h5>
          <button variant="primary" className="btn btn-light" type="submit" onClick={clearForm}>Deposit again</button>
        </>
      )}
    />
  );
}

function Withdraw(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (
    <Card
      bgcolor="secondary"
      header="Withdraw"
      status={status}
      body={show ? 
        <WithdrawForm setShow={setShow} setStatus={setStatus}/> :
        <WithdrawMsg setShow={setShow} setStatus={setStatus}/>}
    />
  );
}

function WithdrawMsg(props){
  return(<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
        props.setShow(true);
        props.setStatus('');
      }}>
        Withdraw again
    </button>
  </>);
}

function WithdrawForm(props){
  const [email, setEmail]   = React.useState('');
  const [amount, setAmount] = React.useState('');

  function handle(){
    const parsed = Number(amount);
    if (!(parsed > 0)) {
      props.setStatus('Enter a valid amount greater than 0');
      return;
    }

    fetch(`/account/update/${email}/-${parsed}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          props.setStatus(data.error);
          return;
        }

        props.setStatus(`Balance: $${Number(data.balance) || 0}`);
        props.setShow(false);
      })
      .catch(() => {
        props.setStatus('Withdraw failed');
      });
  }

  return(<>
    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Amount<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} 
      onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}
      disabled={!email || !amount}>
        Withdraw
    </button>

  </>);
}

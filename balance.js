function Balance(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (
    <Card
      bgcolor="secondary"
      header="Balance"
      status={status}
      body={show ?
        <BalanceForm setShow={setShow} setStatus={setStatus}/> :
        <BalanceMsg setShow={setShow} setStatus={setStatus}/>} 
    />
  );
}

function BalanceMsg(props){
  return(<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
        props.setShow(true);
        props.setStatus('');
      }}>
        Check balance again
    </button>
  </>);
}

function BalanceForm(props){
  const [email, setEmail] = React.useState('');

  function handle(){
    fetch(`/account/findOne/${email}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          props.setStatus(data.error);
          return;
        }
        props.setStatus(`Balance: $${Number(data.balance) || 0}`);
        props.setShow(false);
      })
      .catch(error => {
        props.setStatus(`Lookup failed: ${error.message}`);
      });
  }

  return (<>
    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}
      disabled={!email}>
        Check Balance
    </button>

  </>);
}

function AllData(){
  const [data,setData] = React.useState('');

  React.useEffect(() => {
    fetch('/account/all', { method: 'GET' })
      .then(response => response.json())
      .then(payload => {
        setData(JSON.stringify(payload, null, 2));
      })
      .catch(error => {
        setData(`Failed to load users: ${error.message}`);
      });
  }, []);

  return (
    <>
      <h5>All Users</h5>
      <pre>{data}</pre>
    </>
  );
}

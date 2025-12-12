import { Link } from 'react-router-dom';

function App() {

  return (
    <div style={{ textAlign: 'center', padding: '2rem'}}>
      <h1>NEWS SHERLOCK</h1>
      <p>Welcome! Submit a news article link for analysis</p>

      <nav style={{marginTop: "1rem"}}>
        <Link to="/login"> Login/Register </Link> |{" "}
        <Link to="/home"> Go to Home </Link>
      </nav>
    </div>
  )
}

export default App

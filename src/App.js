import './App.css';
import React from 'react';

const { useEffect, useState } = React;
const axios = require('axios')

const GreetingWrapper = () => {
  const [data, setData] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1/greeting/all')
    .then(function (res) {
      console.log(res)
      setIsLoaded(true)
      setData(res)
    })
    .catch(function (err) {
      console.log(err)
      setError(err)
    })
    .then(function() {
      // Always runs
    })
  }, [])

  if (error.length > 0) {
    console.log({data})
    console.log({error})
    return (
      <div>
        <h2>Guru Meditation: {error.message}</h2>
      </div>
    )
  } else if (!isLoaded) {
    return (
      <div>
        <h2>Please Wait...</h2>
      </div>
    )
  } else {
    console.log(data.data)
    return (
      <div className="greetings-container">
        <h2>Greetings</h2>

        {data.data.map(greeting => (
          <Greeting text={greeting.text} id={greeting.id} likelihood={greeting.likelihood} />
        ))}
        
      </div>
    )
  }
  
}

const Greeting = (props) => {

  //TODO Refactor to use rest/spread?
  const greeting = props.text
  const likelihood = props.likelihood
  const start_date = props.start_date || null
  const end_date = props.end_date || null

  console.log({props})

  return (
    <div className="row">
      <div className={["col", "greeting-text"].join(' ')}>
        {greeting}
      </div>

      <div className={["col", "greeting-likelihood"]}>
        {likelihood}
      </div>

      <div className={['col', 'greeting-start-date']}>
        {start_date}
      </div>

      <div className={['col', 'greeting-end-date']}>
        {end_date}
      </div>

      <div className='actions'>
        <ul>
          <li>
            <button>Update</button>
          </li>
          <li>
            <button>Delete</button>
          </li>
        </ul>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>App Served</h1>
      <GreetingWrapper />
    </div>
  );
}

export default App;

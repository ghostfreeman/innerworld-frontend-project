import './App.css';
import React from 'react';

const { useEffect, useState } = React;
const axios = require('axios')

const GreetingWrapper = () => {
  const [data, setData] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState([]);
  const [changeState, setChangeState] = useState('');

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
  
  useEffect(() => {
    console.log("Reload the table")
    setIsLoaded(false)
    
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
  }, [changeState])

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

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Greeting</th>
                <th>Likelihood (higher = more likely)</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {data.data.map(greeting => (
              <Greeting text={greeting.text} id={greeting._id} likelihood={greeting.likelihood} start_date={greeting.start_date} end_date={greeting.end_date} stateChanger={setChangeState} />
            ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const Greeting = ({stateChanger, ...props}) => {
  const deleteGreeting = (e) => {
    console.log("Delete Greeting Clicked")
    console.log({e})

    axios.delete('http://127.0.0.1/greeting/' + e)
    .then(function (res) {
      console.log(res)
      // TODO Update the <GreetingWrapper>
      stateChanger(e);
    }).catch(function (err) {
      console.log(err)
    })
    .then(function() {
      // Always runs
    })
  }

  const openUpdateModal = (e) => {
    console.log("Opening Edit Modal")
  }

  const id = props.id
  const greeting = props.text
  const likelihood = props.likelihood
  const start_date = props.start_date || null
  const end_date = props.end_date || null
  // const

  return (
    <tr>
      <td>
        <div className={["col", "greeting-text"].join(' ')}>
          {greeting}
        </div>
      </td>

      <td>
        <div className={["col", "greeting-likelihood"]}>
          {likelihood}
        </div>
      </td>

      <td>
        <div className={['col', 'greeting-start-date']}>
          {start_date}
        </div>
      </td>

      <td>
        <div className={['col', 'greeting-end-date']}>
          {end_date}
        </div>
      </td>

      <td>
        <div className='actions'>
          <ul className='actions-list-controller'>
            <li>
              <button onClick={() => {openUpdateModal()}}>Update</button>
            </li>
            <li>
              <button onClick={() => {deleteGreeting({id})}}>Delete</button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
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

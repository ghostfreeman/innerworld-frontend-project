import './App.css'
import React from 'react'
import Modal from 'react-modal'

const { useEffect, useState } = React;
const axios = require('axios')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const RandomGreeting = () => {

}

const GreetingWrapper = () => {
  const [data, setData] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState([])
  const [changeState, setChangeState] = useState('')
  const [modalIsOpen, setIsOpen] = useState(false)
  const [updateState, setUpdateState] = useState(false)

  useEffect(() => {
    axios.get('http://127.0.0.1/greeting/all')
    .then(function (res) {
      setIsLoaded(true)
      setData(res)
    })
    .catch(function (err) {
      setError(err)
    })
    .then(function() {
      // Always runs
    })
  }, [])
  
  useEffect(() => {
    setIsLoaded(false)
    closeModal()

    axios.get('http://127.0.0.1/greeting/all')
    .then(function (res) {
      setIsLoaded(true)
      setData(res)
    })
    .catch(function (err) {
      setError(err)
    })
    .then(function() {
      // Always runs
    })
  }, [changeState])

  useEffect(() => {
    if (updateState) {
      openModal()
    } else {
      closeModal()
    }
  }, [updateState])

  const openModal = () => {
    setIsOpen(true)
  }

  const afterOpenModal = () => {}

  const closeModal = () => {
    setIsOpen(false);
  }

  const createNewGreeting = () => {
    openModal()
  }

  if (error.length > 0) {
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
    return (
      <div className="greetings-container">
        <h2>Greetings</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Greeting</th>
                <th>Likelihood</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {data.data.map(greeting => (
              <Greeting 
              text={greeting.text} 
              id={greeting._id} 
              likelihood={greeting.likelihood} 
              start_date={greeting.start_date} 
              end_date={greeting.end_date} 
              stateChanger={setChangeState} 
              updateState={setUpdateState} />
            ))}
            </tbody>
          </table>
        </div>

        <div>
          <button onClick={() => {createNewGreeting()}}>Create New Greeting</button>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal">
            <EditGreeting stateChanger={setChangeState} />
        </Modal>
            
      </div>
    )
  }
}

const EditGreeting = ({stateChanger, ...props}) => {
  const [greeting, setGreeting] = useState('')
  const [likelihood, setLikelihood] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const createNewGreeting = () => {
    axios.post('http://127.0.0.1/greeting/create', {
      text: greeting,
      likelihood: likelihood,
      start_date: startDate,
      end_date: endDate
    })
    .then(function (res) {
      setGreeting('')
      setLikelihood(0)
      setStartDate('')
      setEndDate('')
      stateChanger(greeting);
    })
    .catch(function (err) {
      console.log(err)
    })
    .then(function() {
      // Always runs
    })
  }

  return (
    <div className="edit-container">
      <input type='text' placeholder='Greeting Text' name="greeting" onChange={event => setGreeting(event.target.value)} />
      <input type='number' placeholder='0' name="likelihood" onChange={event => setLikelihood(event.target.value)} />
      <input type='date' name="start_date" onChange={event => setStartDate(event.target.value)} />
      <input type='date' name="end_date" onChange={event => setEndDate(event.target.value)} />
      <button onClick={() => createNewGreeting()}>Create</button>
    </div>
  )
}

const CreateGreeting = () => {}

const Greeting = ({stateChanger, updateState, ...props}) => {
  const deleteGreeting = (e) => {
    axios.delete('http://127.0.0.1/greeting/' + e)
    .then(function (res) {
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
    // updateState(true)
  }

  const id = props.id
  const greeting = props.text
  const likelihood = props.likelihood
  const start_date = props.start_date || null
  const end_date = props.end_date || null

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
              <button onClick={() => {deleteGreeting({id})}} className="delete">Delete</button>
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

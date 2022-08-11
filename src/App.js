import './App.css'
import React from 'react'
import ReactDOM from 'react-dom'
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

  const afterOpenModal = () => {

  }

  const closeModal = () => {
    setIsOpen(false);
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

        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal">
            <EditGreeting />
        </Modal>
            
      </div>
    )
  }
}

const EditGreeting = ({stateChanger, ...props}) => {
  return (
    <div className="edit-container">
      <input type='text' placeholder='Greeting Text' />
      <input type='number' placeholder='0' />
      <input type='date' />
      <input type='date' />
    </div>
  )
}

const CreateGreeting = () => {}

const Greeting = ({stateChanger, updateState, ...props}) => {
  const deleteGreeting = (e) => {
    console.log("Delete Greeting Clicked")
    console.log({e})

    axios.delete('http://127.0.0.1/greeting/' + e)
    .then(function (res) {
      console.log(res)
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
    updateState(true)
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
              <button onClick={() => {openUpdateModal()}} className="action">Update</button>
            </li>
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

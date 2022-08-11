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
  const [greeting, setGreeting] = useState('')
  const [error, setError] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1/greeting')
    .then(function (res) {
      setGreeting(res.text)
    })
    .catch(function (err) {
      setError(err)
    })
    .then(function() {
      // Always runs
    })
  })

  return (
    <div>
      <h1>{greeting}</h1>
    </div>
  )
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
                <th>Display in Mornings</th>
                <th>Display in Afternoons</th>
                <th>Display in Evenings</th>
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
              clamp_morning={greeting.clamp_to_morning}
              clamp_to_afternoon={greeting.clamp_to_afternoon}
              clamp_to_evening={greeting.clamp_to_evening}
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
  const [clampMornings, setClampMornings] = useState(false)
  const [clampAfternoons, setClampAfternoons] = useState(false)
  const [clampEvenings, setClampEvenings] = useState(false)



  

  const createNewGreeting = () => {
    const obj = {
      text: greeting,
      likelihood: likelihood,
      start_date: startDate,
      end_date: endDate,
      clamp_to_morning: clampMornings === "on" ? true : false,
      clamp_to_afternoon: clampAfternoons === "on" ? true : false,
      clamp_to_evening: clampEvenings === "on" ? true : false
    }
    console.log({obj})

    axios.post('http://127.0.0.1/greeting/create', obj)
    .then(function (res) {
      setGreeting('')
      setLikelihood(0)
      setStartDate('')
      setEndDate('')
      setClampMornings(false)
      setClampAfternoons(false)
      setClampEvenings(false)
      stateChanger(greeting)
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
      <div className='form-element'>
        <label for="greeting">Greeting Text</label>
        <input type='text' placeholder='Greeting Text' name="greeting" onChange={event => setGreeting(event.target.value)} />
      </div>

      <div className='form-element'>
        <label for="likelihood">Likelihood</label>
        <input type='number' placeholder='0' name="likelihood" onChange={event => setLikelihood(event.target.value)} />
      </div>

      <div className='form-element'>
        <label for="start_date">Start Date</label>
        <input type='date' name="start_date" onChange={event => setStartDate(event.target.value)} />
      </div>

      <div className='form-element'>
        <label for="end_date">End Date</label>
        <input type='date' name="end_date" onChange={event => setEndDate(event.target.value)} />
      </div>

      <div className='form-element'>
        <label for="clamp_mornings">Clamp to mornings (00:00 - 11:59)</label>
        <input type="checkbox" name="clamp_mornings" onChange={event => setClampMornings(event.target.value)}></input>
      </div>

      <div className='form-element'>
        <label for="clamp_afternoons">Clamp to afternoons (12:00 - 18:59)</label>
        <input type="checkbox" name="clamp_afternoons" onChange={event => setClampAfternoons(event.target.value)}></input>
      </div>

      <div className='form-element'>
        <label for="clamp_evenings">Clamp to evenings (19:00 - 23:59)</label>
        <input type="checkbox" name="clamp_evenings" onChange={event => setClampEvenings(event.target.value)}></input>
      </div>

      <button onClick={() => createNewGreeting()}>Create</button>
    </div>
  )
}

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

  const id = props.id
  const greeting = props.text
  const likelihood = props.likelihood
  const start_date = props.start_date || null
  const end_date = props.end_date || null
  const clamp_morning = props.clamp_morning || null
  const clamp_afternoon = props.clamp_afternoon || null
  const clamp_evening = props.clamp_evening || null

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
        <div className={['col', 'greeting-clamp-morning']}>
          {clamp_morning ? "Yes" : "No"}
        </div>
      </td>

      <td>
        <div className={['col', 'greeting-clamp-afternoon']}>
          {clamp_afternoon ? "Yes" : "No"}
        </div>
      </td>

      <td>
        <div className={['col', 'greeting-clamp-evening']}>
          {clamp_evening ? "Yes" : "No"}
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
      <RandomGreeting />
      <GreetingWrapper />
    </div>
  );
}

export default App;

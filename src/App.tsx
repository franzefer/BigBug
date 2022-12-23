import './App.css'
import React, { useEffect, useState } from 'react'
import lottery from './lottery'
import web3 from './web3'

const App: React.FC = () => {
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState('')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [currentWinner, setCurrentWinner] = useState('')
  const [reload, setReload] = useState(false)
  const [contract, setContract] = useState('')

  useEffect(() => {
    const init = async () => {
      const manager = await lottery.methods.manager().call()
      const players = await lottery.methods.getPlayers().call()
      const amount = await lottery.methods.getAmount().call()
      const currentWinner = await lottery.methods.getCurrentWinner().call()

      setManager(manager)
      setPlayers(players)
      setBalance(await web3.eth.getBalance(lottery.options.address))
      setAmount(amount)
      setCurrentWinner(currentWinner)
      setContract(lottery.options.address)
    }
    init()
  }, [reload])

  const submitForm = async (e: any) => {
    e.preventDefault()
    const accounts = await web3.eth.getAccounts()
    setMessage('Ожидание успешной транзакции...')

    await lottery.methods.enter(value).send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'wei'),
    })
    setValue('')
    setMessage('Платеж зачислен!')
    setReload(!reload)
  }

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts()
    setMessage('Выбор победителя...')
    setMessage('Ожидание успешной транзакции...')

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    })

    setMessage('Победитель был выбран!')
    setReload(!reload)
  }

  const onGetPrize = async () => {
    const accounts = await web3.eth.getAccounts()

    // setCurrentAccount(accounts[0]);
    setMessage('Ожидание успешной транзакции...')

    await lottery.methods.getPrize().send({
      from: accounts[0],
    })

    setMessage('Награда получена!')
  }

  return (
    <div>
      <h2>Лотерея</h2>
      <p>Адрес контракта: {contract}</p>
      <p>Контракт управляется: {manager}</p>
      <p>
        В настоящее время {players.length} участников, борятся за:{' '}
        {web3.utils.fromWei(balance, 'wei')} wei!
      </p>
      <hr />
      <form onSubmit={submitForm}>
        <h4>Хотите испытать удачу?</h4>
        <div>
          <label>Сумма в wei </label>
          <input
            style={{ marginLeft: '1vw' }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <br />
          <br />
          <button>Подтвердить</button>
        </div>
      </form>

      <hr />

      <div>
        <h4>Розыгрыш</h4>
        <button onClick={onPickWinner}>Определить победителя!</button>
      </div>
      <div>
        <h4>Награда: {amount} Wei</h4>
      </div>
      <div>
        <h4>Получить приз</h4>
        <button onClick={onGetPrize}>Получить приз</button>
      </div>
      <div>
        <h4>Победители </h4>
        <p>Победитель: {currentWinner}</p>
      </div>
      <div>
        <h4>Донатеры </h4>
        <ul>
          {players.map((item) => {
            return <li>Донатер: {item}</li>
          })}
        </ul>
      </div>
      <hr />
      <h1>{message}</h1>
    </div>
  )
}
export default App

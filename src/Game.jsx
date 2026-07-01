import './Game.css'
import Players from './Players'
import Table from './components/Table'
function Game(props) {
  return (
    <>
      <Table {...props}/>
      <Players/>
    </>



  )
}

export default Game

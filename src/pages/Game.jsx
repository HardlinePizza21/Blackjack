import '../styles/Game.css'
import Players from '../container/Players'
import Table from '../components/Table'

function Game(props) {
  return (
    <>
      <Table {...props}/>
      <Players/>
    </>
  )
}

export default Game

import './App.css'
import { Keyboard } from './components/Keyboard'

function App() {

  return (
    <>
      <div className='landscape:hidden h-screen flex flex-col justify-center items-center'>
        <Keyboard />
      </div>
      <div className='p-4 hidden flex-col landscape:flex justify-center items-center h-screen'>
        <Keyboard />
      </div>
    </>
  )
}

export default App

import { useState } from 'react'
import './index.css'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     
       <h1 class="text-sm font-bold">
    Hello world!
  </h1>
  <Button>Done</Button>
      
    </>
  )
}

export default App

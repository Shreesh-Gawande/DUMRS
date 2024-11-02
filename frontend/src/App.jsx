import Profile from "./components/Profile"
import Sidebar from "./components/Sidebar"
function App() {

  return (
    <>
    <main className='h-screen w-screen bg-background flex flex-row '>
    <Sidebar/>
    <Profile/>
    </main>
    </>
  )
}

export default App

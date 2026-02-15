import { Layout } from './components/index.ts'
import { TasksPage } from './features/tasks/index.ts'
import './App.css'

function App() {
  return (
    <Layout>
      <TasksPage />
    </Layout>
  )
}

export default App

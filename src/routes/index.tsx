import PullRequestForm from '../components/PullRequestForm'
import MainLayout from '../components/base/MainForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <MainLayout>
      <PullRequestForm />
    </MainLayout>
  )
}

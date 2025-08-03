import Review from '../components/Review'
import MainLayout from '../components/base/MainForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/review')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      prUrl: search.prUrl as string
    }
  }
})

function RouteComponent() {
  return (
    <MainLayout>
      <Review />
    </MainLayout>
  )
}

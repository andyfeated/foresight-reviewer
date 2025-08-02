import { useEffect, useState } from "react"
import { useSearch } from "@tanstack/react-router"

const Review: React.FC = () => {
  const { prUrl } = useSearch({ from: '/review' })
  const [error, setError] = useState('')

  return (
    <div>Review test</div>
  )
}

export default Review
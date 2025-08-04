import { useEffect, useState } from "react"
import { useSearch } from "@tanstack/react-router"
import axios from "axios"

const Review: React.FC = () => {
  const { prUrl } = useSearch({ from: '/review' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!prUrl) {
      setError('PR URL not found')
    }

    const handleReview = async () => {
      try {
        const reviewResult = await axios.post(
          `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/review`,
          { pullRequestUrl: prUrl },
          { withCredentials: true }
        )

        console.log(reviewResult)
      } catch(err: any) {
        setError(err.response.data.error)
      }
    }

    handleReview()
  }, [])

  if (error) {
    return <div>{error}</div>
  }
  
  return (
    <div>
      Review test
    </div>
  )
}

export default Review
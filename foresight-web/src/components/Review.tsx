import { useEffect, useState } from "react"
import { useSearch } from "@tanstack/react-router"
import axios from "axios"

const Review: React.FC = () => {
  const { prUrl } = useSearch({ from: '/review' })
  const [data, setData] = useState<any>(null)
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

        setData(reviewResult.data.data)
      } catch(err: any) {
        setError(err.response.data.error)
      }
    }

    handleReview()
  }, [])

  if (!error && !data) {
    return <div>Loading...</div>
  }
  
  if (error) {
    return <div>{error}</div>
  }
  
  return (
    <div>
      <p>{data?.prDetails?.title}</p>
    </div>
  )
}

export default Review
import { useEffect, useState } from "react"
import { useSearch } from "@tanstack/react-router"
import axios from "axios"

const Review: React.FC = () => {
  const { prUrl } = useSearch({ from: '/review' })
  const [accessResult, setAccessResult] = useState<any>(null)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {    
    if (!prUrl) {
      setError('PR URL not found')
    }

    const decodedPrUrl = decodeURIComponent(prUrl)

    const handleCheckAccess = async () => {
      try {
        const checkAccessResult = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/review/check-access`,
          { pullRequestUrl: decodedPrUrl },
          { withCredentials: true }
        )

        setAccessResult(checkAccessResult.data)
      } catch (err: any) {
        setError(err.response.data.error)
      }
    }

    handleCheckAccess()
  }, [])

  useEffect(() => {
    if (accessResult) {
      if (accessResult?.authRequired && !accessResult?.hasAccessToPR) {
        // not logged in and no access to PR
        window.location.href = accessResult.oauthUrl
      } else if (!accessResult?.authRequired && accessResult?.hasAccessToPR) {
        // logged in and has access to PR (private)
        // or not logged in but still has access to PR (public)
        console.log(accessResult)
      } else if (!accessResult?.authRequired && !accessResult?.hasAccessToPR) {
        // logged in but no access to PR
        setError('PR either does not exist or your account does not have access to it')
      } else {
        setError('An error occured')
      }
    }
  }, [accessResult])

  if (!error && !data) {
    return <div>Loading...</div>
  }
  
  if (error) {
    return <div>{error}</div>
  }
  
  return (
    <div>
      <p>{data?.title}</p>
    </div>
  )
}

export default Review
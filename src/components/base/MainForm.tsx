import { ArrowRightIcon, Github, Gitlab, SearchCode } from 'lucide-react'
import { useState } from 'react'

const MainForm: React.FC = () => {
  const [prUrl, setPrUrl] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!prUrl.trim()) {
      setError('Please enter a PR URL')
      return
    }

    setError('')
  }
  
  return (
    <main className="flex flex-1 max-w-7xl mx-auto w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <div className='flex gap-4 mb-4'>
          <div className='inline-block p-4 rounded-full bg-gray-900'>
            <Github size={48} />
          </div>

          <div className='inline-block p-4 rounded-full bg-gray-900'>
            <Gitlab size={48} />
          </div>
        </div>

        <div className='flex'>
          <h2 className="text-white font-bold text-3xl mb-3">
            Foresight Reviewer
          </h2>

          <SearchCode className='ml-1' />
        </div>

        <p className="text-gray-400 max-w-md text-center">
          Paste a GitHub or Gitlab pull request URL to quickly see what needs to be
          addressed
        </p>

        <form onSubmit={handleSubmit} className='w-full max-w-lg mt-8'>
          <div className='relative'>
            <input
              type='text'
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              placeholder="https://github.com/organization/repo/pull/123"
              className='w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />

            <button
              type='submit'
              className='absolute p-2 top-1.5 right-2 bg-blue-600 hover:bg-blue-700 rounded-md'
            >
              <ArrowRightIcon size={20} />
            </button>
          </div>
        </form>

        {error && (
          <div className='text-red-500 text-sm w-130'>
            <p className='self-start ml-1 mt-3'>{error}</p>
          </div>
        )}

        <div className='text-gray-500 text-sm mt-8 mb-20'>
          Example: https://github.com/facebook/react/pull/24502
        </div>
      </div>
    </main>
  )
}

export default MainForm
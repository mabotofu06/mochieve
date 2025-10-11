'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import { store } from './_state/store'
import { setLoading } from './_state/slice/modal'
import { createLogger } from './_constants/utils/logger'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    const logger = createLogger('ErrorBoundary');
    logger.error("アプリケーションエラーが発生しました", { error: error.message, digest: error.digest });
    store.dispatch(setLoading(false));
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
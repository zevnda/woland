import React, { ReactNode } from 'react'
import { Button } from '@heroui/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-4 px-4 bg-white'>
          <div className='text-center w-full max-w-sm'>
            <h1 className='text-2xl font-bold text-zinc-900 mb-2'>Something went wrong</h1>
            <p className='text-zinc-600 mb-4 break-words'>
              An unexpected error occurred. Please try restarting the app.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='text-left bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800 max-w-md mx-auto'>
                <summary className='cursor-pointer font-semibold mb-2'>Error Details</summary>
                <pre className='whitespace-pre-wrap wrap-break-word font-mono text-xs overflow-auto max-h-40'>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <Button variant='primary' onPress={this.handleReset}>
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

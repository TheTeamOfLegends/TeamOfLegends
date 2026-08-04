import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type ErrorBoundaryProps = {
  children: ReactNode
  /** If true, render Navigate to /500 (must be inside a Router). */
  redirect?: boolean
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

/**
 * Ловит непредвиденные ошибки рендера в дереве React.
 * По умолчанию перенаправляет на /500.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      'ErrorBoundary перехватил ошибку:',
      error,
      info.componentStack
    )
  }

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback
    }

    if (this.props.redirect !== false) {
      return <Navigate to="/500" replace />
    }

    return null
  }
}

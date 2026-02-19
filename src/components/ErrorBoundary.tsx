import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if this is a known Radix UI error (Tabs, Select, Dialog, Popover, etc.)
    const errorMessage = error.message?.toLowerCase() || '';
    const errorName = error.name?.toLowerCase() || '';
    const componentStack = errorInfo.componentStack?.toLowerCase() || '';
    
    const isKnownRadixError = 
      errorMessage.includes('removechild') || 
      errorMessage.includes('the node to be removed is not a child') ||
      errorMessage.includes('failed to execute') ||
      errorName === 'notfounderror' ||
      componentStack.includes('radix') ||
      componentStack.includes('select') ||
      componentStack.includes('tabs') ||
      componentStack.includes('dialog') ||
      componentStack.includes('popover');
    
    if (isKnownRadixError) {
      // Log but don't show error UI for this known issue
      console.warn('[Non-Critical] Known Radix UI error suppressed:', error.message);
      // Reset the error state immediately without showing error screen
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
      return;
    }
    
    // Log error details to console for other errors
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided by parent
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Oops! Algo deu errado</CardTitle>
                  <CardDescription>
                    Ocorreu um erro inesperado na aplicação
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message */}
              {this.state.error && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-sm mb-2">Mensagem de Erro:</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {/* Error Stack (Development Only) */}
              {(import.meta as any).env?.DEV && this.state.errorInfo && (
                <details className="p-4 bg-muted rounded-lg">
                  <summary className="font-semibold text-sm cursor-pointer hover:text-primary">
                    Detalhes Técnicos (Desenvolvimento)
                  </summary>
                  <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-64 font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Help Text */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>O que você pode fazer:</strong>
                </p>
                <ul className="mt-2 text-sm text-blue-800 dark:text-blue-200 list-disc list-inside space-y-1">
                  <li>Tente recarregar a página</li>
                  <li>Verifique sua conexão com a internet</li>
                  <li>Limpe o cache do navegador</li>
                  <li>Se o problema persistir, entre em contato com o suporte</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Ir para Início
                </Button>
              </div>

              {/* Support Info */}
              <div className="text-center pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Se precisar de ajuda, entre em contato com o suporte técnico
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * Hook version for functional components (optional)
 * Note: Error boundaries must be class components, but you can wrap them
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

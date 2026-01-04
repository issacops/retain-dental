import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-white font-mono">
                    <div className="bg-rose-900/20 border border-rose-500/50 p-8 rounded-2xl max-w-4xl w-full text-left">
                        <h1 className="text-3xl font-black text-rose-500 mb-4">CRITICAL SYSTEM FAILURE</h1>
                        <p className="text-lg mb-8">The application encountered an unrecoverable render error.</p>

                        <div className="bg-black/50 p-6 rounded-xl overflow-auto border border-white/10 mb-6">
                            <p className="font-bold text-rose-300 mb-2">{this.state.error?.toString()}</p>
                            <pre className="text-xs text-slate-400 whitespace-pre-wrap">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.href = '/platform'}
                            className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-slate-200"
                        >
                            Reset to Platform
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

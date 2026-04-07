import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Zenith Production Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 flex-col text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">We've encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-8 px-6 py-3 bg-[#1A1C2E] text-white font-bold rounded-2xl shadow-lg hover:scale-[1.02] transition-transform"
            >
                Refresh Workspace
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

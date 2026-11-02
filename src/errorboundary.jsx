import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('CityConnect render failure:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-error">
          <AlertTriangle size={25} />
          <h1>CityConnect could not render this view.</h1>
          <p>{this.state.error.message || 'An unexpected interface error occurred.'}</p>
          <button onClick={() => window.location.reload()}><RotateCcw size={15} /> Reload application</button>
        </main>
      );
    }
    return this.props.children;
  }
}

import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import './App.css';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Outlet />
    </ErrorBoundary>
  )
}

export default App

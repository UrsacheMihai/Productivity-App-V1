import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Changed here to HashRouter
import { Clock } from 'lucide-react';
import Home from './pages/Home';
import TodoList from './pages/TodoList';
import Scheduler from './pages/Scheduler';

function App() {
  return (
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Particle wave animation background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
          </div>

          {/* Navigation */}
          <nav className="relative bg-blue-900/80 backdrop-blur-sm shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                  <Link
                      to="/"
                      className="text-white font-semibold text-lg flex items-center space-x-2"
                  >
                    <Clock className="h-6 w-6" />
                    <span>Scheduler</span>
                  </Link>

                  <div className="flex space-x-4">
                    <Link
                        to="/"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition"
                    >
                      Home
                    </Link>
                    <Link
                        to="/todo"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition"
                    >
                      TO-DO List
                    </Link>
                    <Link
                        to="/scheduler"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition"
                    >
                      Scheduler
                    </Link>
                  </div>
                </div>

                <div className="text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="relative max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/todo" element={<TodoList />} />
              <Route path="/scheduler" element={<Scheduler />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;

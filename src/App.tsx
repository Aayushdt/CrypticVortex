import SignUp from './components/SignUp';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-[1100px] bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
        <SignUp />
      </div>
    </div>
  );
}

export default App; 
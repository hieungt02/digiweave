import './App.css';
import { Routes, Route } from 'react-router-dom'; // 1. Import routing components
import CollectionsList from './components/CollectionsList';
import CollectionView from './components/CollectionView';

function App() {
  return (
    <div className="App">
      <h1>DigiWeave</h1>

      {/* 2. Define the routes */}
      <Routes>
        <Route path="/" element={<CollectionsList />} />
        <Route path="/collections/:id" element={<CollectionView />} />
      </Routes>
    </div>
  );
}

export default App;
import './App.css';
import { Routes, Route } from 'react-router-dom';
import CollectionsList from './components/CollectionsList';
import CollectionView from './components/CollectionView';
//Import the necessary parts from react-dnd
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    //Wrap everything inside the DndProvider
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <h1>DigiWeave</h1>

        <Routes>
          <Route path="/" element={<CollectionsList />} />
          <Route path="/collections/:id" element={<CollectionView />} />
        </Routes>
      </div>
    </DndProvider>
  );
}

export default App;
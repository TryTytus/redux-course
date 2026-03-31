import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import Intro from './exercises/Intro';
import DataFlow from './exercises/DataFlow';
import Immutability from './exercises/Immutability';
import PureFunctions from './exercises/PureFunctions';
import SourceOfTruth from './exercises/SourceOfTruth';

const exercises = [
  { id: 'intro', title: 'Introduction', component: Intro },
  { id: 'data-flow', title: '1. One-Way Data Flow', component: DataFlow },
  { id: 'immutability', title: '2. The Immutability Challenge', component: Immutability },
  { id: 'pure-functions', title: '3. Pure Function Sorter', component: PureFunctions },
  { id: 'source-of-truth', title: '4. Single Source of Truth', component: SourceOfTruth },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  const ActiveComponent = exercises[activeIndex].component;

  return (
    <Layout sidebar={
      <Sidebar 
        exercises={exercises} 
        activeIndex={activeIndex} 
        onChange={setActiveIndex} 
      />
    }>
      <ActiveComponent />
    </Layout>
  );
}

export default App;

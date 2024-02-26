
import './App.css';
import Draw from './pages/Draw';
import Layout from './Layout';
import DictionaryView from './pages/Dictionary';
import Home from './pages/Home';

 
function App(this: any) {
  return (
    <Layout>
      <Home message={'Welcome back'} user={'Charlotte'} />
      <Draw />
      <DictionaryView title={"My Words"} />
    </Layout>
  );
}

export default App;
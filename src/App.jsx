import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PokeList from './components/PokeList'
import axios from "axios";



function App() {

  const [search, setSearch] = useState("");
  const [pokemons, setPokemons] = useState([])
  const [types, setTypes] = useState([])

  useEffect(() => {
    getPokemons();
  }, []);

  useEffect(() => {
    if(pokemons.length > 0) {
      getTypes(pokemons);
    }
  }, [pokemons])

  const getTypes = (pokemons) => {
    const listtype = pokemons.map((pokemon) => pokemon.data.types[0].type.name);
    setTypes(listtype);
  };

  const getPokemons = () => {
    var endpoints = [];
    for (var i = 1; i < 152; i++) {
      endpoints.push(`https://pokeapi.co/api/v2/pokemon/${i}/`);
    }
    // console.log(endpoints);
    axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
    .then((res) => setPokemons(res))
    .catch(error => console.error(error));
    
  }

  // useEffect(() => {
  //   const fetchPokemons = async () => {
  //     const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151', {
  //       method: 'GET',
  //     });
  //     const data = await response.json();
  //     setPokemons(data.results);

  //   }
  //   fetchPokemons();
  // }, [])

  return (
   <div className=''>
    <PokeList pokemons={pokemons} types={types} search={search} setSearch={setSearch} />
   </div>
  )
}

export default App

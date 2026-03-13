import "../css/type.css"
import { useNavigate } from "react-router-dom";

function PokeList(props) {
    console.log(props)

     const navigate = useNavigate();

    function onSeeDetailsClick(pokemon) {
      const query = new URLSearchParams();
      query.set('id', pokemon.data.id);
      navigate(`/pokemon?${query.toString()}`);
    }

    const filteredPokemons = props.pokemons.filter((pokemon) =>
      pokemon.data.name.toLowerCase().includes(props.search.toLowerCase())
    );

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mt-5 mb-5">Pokedex</h1>
        <input type="text" value={props.search} onChange={(e) => props.setSearch(e.target.value)} placeholder="Search Pokemon" className="border"/>
      </div>

      
      <div className=" bg-white h-screen w-screen grid grid-cols-3 gap-5 p-5 justify-items-center">

        {props.search === "" ? null : filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon, index) => (
            <div onClick={() =>onSeeDetailsClick(pokemon)} className={`bg-gray-200 h-50 w-50 p-3 flex flex-col items-center justify-center rounded-3xl shadow-lg ${pokemon.data.types[0].type.name}`} key={index}>
              <h2 className="text-center uppercase">{pokemon.data.name}</h2>
              <span className="text-sm text-gray-500">#{pokemon.data.id}</span>
              <img className="" src={pokemon.data.sprites.front_default} alt="" />
            </div>
          ))
        ) : null}

        {props.search < 1 && props.pokemons && props.pokemons.map((pokemon, index) => (
          // console.log(pokemon.data.types[0].type.name),
          
          <div onClick={() => onSeeDetailsClick(pokemon)} className={`bg-gray-200 h-50 w-50 p-3 flex flex-col items-center justify-center rounded-3xl shadow-lg ${pokemon.data.types[0].type.name}`} key={index}>
              <h2 className="text-center uppercase">{pokemon.data.name}</h2>
              <span className="text-sm text-gray-500">#{pokemon.data.id}</span>
              <img className="" src={pokemon.data.sprites.front_default} alt="" />
              <div className={`icon${pokemon.data.types[0].type.name}`}>
                <span className="">{pokemon.data.types[0].type.name}</span>
              </div>
              {pokemon.data.types.length > 1 && (
                <div className={`icon${pokemon.data.types[1].type.name}`}>
                  <span className="">{pokemon.data.types[1].type.name}</span>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PokeList;
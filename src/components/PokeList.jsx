import "../css/type.css"

function PokeList(props) {
    console.log(props)

    

  return (

    <div className=" bg-white h-screen w-screen grid grid-cols-3 gap-5 p-5 justify-items-center">
      {props.pokemons && props.pokemons.map((pokemon, index) => (
        // console.log(pokemon.data.types[0].type.name),
        <div className={`bg-gray-200 h-50 w-50 p-3 flex flex-col items-center justify-center rounded-3xl shadow-lg ${pokemon.data.types[0].type.name}`} key={index}>
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
  )
}

export default PokeList;
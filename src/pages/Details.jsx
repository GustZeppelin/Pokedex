import axios from "axios";
import { useSearchParams , useNavigate, useFetcher } from "react-router-dom";
import { useEffect, useState } from "react";
import '../css/details.css'
import '../css/type.css'
import 'charts.css';


function Details() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pokemonId = searchParams.get('id');


    const [data, setData] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [evolutions, setEvolutions] = useState([]);
    const [moves, setMoves] = useState([]);

    async function dataPokemon() {
      try {
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
        const pokemon = pokemonResponse.data;
        setData(pokemon);
        getEvolutionChain(pokemon);
        const moves = getDetailedMoves(pokemon).then();
        setMoves(moves);

        const wikiResponse = await axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${pokemon.name}`);
        setDescriptions(wikiResponse.data);

        const abilityResponses = await Promise.all(
          pokemon.abilities.map(res => axios.get(res.ability.url))
        );
        const abilitiesData = abilityResponses.map(res => res.data);
        setAbilities(abilitiesData);

      } catch (error) {
        console.error(error);
      } 
    }

    async function getEvolutionChain(pokemon) {
      try {
        const speciesResponse = await axios.get(pokemon.species.url);
        const evolution = await axios.get(speciesResponse.data.evolution_chain.url);
        const firstFormResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evolution.data.chain.species.name}`);
        const evolutions = [firstFormResponse.data]
        if (evolution.data.chain.evolves_to.length === 1) {
          const secondFormResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evolution.data.chain.evolves_to[0].species.name}`);
          evolutions.push(secondFormResponse.data);
        }
        if (evolution.data.chain.evolves_to[0].evolves_to.length === 1) {
          const thirdFormResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${evolution.data.chain.evolves_to[0].evolves_to[0].species.name}`);
          evolutions.push(thirdFormResponse.data);
        }
        setEvolutions(evolutions)

      } catch (error){
        console.error(error);
      }
    }


    async function getMoves(pokemon) {
      const moves = pokemon?.moves?.map(moveInfo => ({
        name: moveInfo.move.name, 
        url: moveInfo.move.url
      }));
      return moves;
    } 

    async function getDetailedMoves(pokemonName) {
      const moves = await getMoves(pokemonName);

      if (!moves) return null;

      const detailedMoves = await Promise.all(
        moves.map(async (move) => {
          const res = await fetch(move.url);
          const moveData = await res.json();

          return{
            name: move.name,
            power: moveData.power,
            accuracy: moveData.accuracy,
            type: moveData.type.name
          };
        })
      );
        return detailedMoves;
    };
    
  console.log(moves)

    useEffect(() => {
      dataPokemon();
      window.scrollTo(0, 0);
    }, []);

    return (
        <div className="details-container">
            <div className="poke-infos">
                {data && <h1 className="poke-name">{data?.name}</h1>}
                {descriptions && <p className="description">{descriptions?.extract}</p>}
                <div className="data-pokedex">
                    {data && <img className="img" src={data?.sprites?.other?.['official-artwork']?.front_default} alt={data.name} />}
                    <div className="data-item">
                      <p className="data-pokedex-item">Height: {data?.height}</p>
                      <p className="data-pokedex-item">Weight: {data?.weight}</p>
                      <p className="data-pokedex-item">Base Experience: {data?.base_experience}</p>


                      <div className="types-container">
                        <p className="data-pokedex-item">Types:</p> 
                        {data?.types?.map((typeInfo) => (
                          <span key={typeInfo.type.name} className={`icon${typeInfo.type.name}`}>
                            {typeInfo.type.name}
                          </span>
                        ))}
                      </div>       
                    </div> 
                </div>
                        <div className="abilities">
                          <h1>Abilities</h1>
                          {abilities.map((ability) => {
                            const effect = ability.effect_entries.find(
                              (e) => e.language.name === "en"
                            );

                            return (
                              <div className="ability" key={ability.name}>
                                <h2 className="ability-name">{ability.name}</h2>
                                <span className="ability-description">{effect?.effect}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="table-container">
                          <h1>Base Stats</h1>   
                          <table className="table">
                            <tr>
                              <th>HP</th>
                              <th>ATTACK</th>
                              <th>DEFENSE</th>
                              <th>SPECIAL ATTACK</th>
                              <th>SPECIAL DEFENSE</th>
                              <th>SPEED</th>
                            </tr>    
                            <tr>
                              <td>{data?.stats?.[0]?.base_stat}</td>
                              <td>{data?.stats?.[1]?.base_stat}</td>
                              <td>{data?.stats?.[2]?.base_stat}</td>
                              <td>{data?.stats?.[3]?.base_stat}</td>
                              <td>{data?.stats?.[4]?.base_stat}</td>
                              <td>{data?.stats?.[5]?.base_stat}</td>
                            </tr>                       
                          </table>
                        </div>
                        <div className="evolution-chart-container">
                          <h1>Evolution Chart</h1>
                          <div className="evolution-list">
                            {evolutions.map((pokemon, index) => (
                            <div className="evo-card" key={index}>
                              <img className="img-evo" src={pokemon.sprites.other?.['official-artwork']?.front_default} alt={pokemon.name} />
                              <h1>{pokemon.name}</h1>                                
                            </div>
                          ))}
                          </div>                  
                        </div>
                          <div className="moves-list-container">
                            {/* <h1>Moves learned by {data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h1> */}
                            <div className="moves-lvl">
                              <table>
                                <caption>
                                  Moves Learnt by level up
                                </caption>
                                <thead>
                                  <tr>
                                    <th scope="col">Lv</th>
                                    <th scope="col">Move</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Cat.</th>
                                    <th scope="col">Power</th>
                                    <th scope="col">Acc.</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    {/* {moves.map((move) => (
                                      <tr key={move.name}>
                                        <td>{move.level}</td>
                                        <td>{moveData.type}</td>
                                        <td>{move.category}</td>
                                        <td>{move.power ?? "-"}</td>
                                        <td>{move.accuracy ?? "-"}</td>
                                      </tr>
                                    ))} */}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                    
                          
                <button className="back-button" onClick={() => navigate('/')}>Back</button>
            </div>
        </div>
    )
}

export default Details
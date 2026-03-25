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
        getMoves(pokemon);

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
      return getDetailedMoves(moves);
    } 

    async function getDetailedMoves(moves) {
      const moveResponse = await axios.all(moves.map((move) => axios.get(move.url)));
      setMoves(moveResponse);
    }

    useEffect(() => {
      dataPokemon();
      window.scrollTo(0, 0);
    }, []);
console.log(data);
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
                            <div className="moves-lvl">
                              <table>
                                <caption>
                                  <h1>Moves learned by {data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}</h1>
                                </caption>
                                <thead>
                                  <tr>
                                    <th scope="col">Move</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Cat.</th>
                                    <th scope="col">Power</th>
                                    <th scope="col">Acc.</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {moves.map((move) => (                           
                                    <tr>
                                      {/* colocar o nivel que aprende a habildiade e filtrar apenas as que são aprendidas por nivel */}
                                      <td>{move.data.name.charAt(0).toUpperCase() + move.data.name.slice(1)}</td> 
                                      <td>{move.data.type.name.charAt(0).toUpperCase() + move.data.type.name.slice(1)}</td>    
                                      <td>{move.data.damage_class.name.charAt(0).toUpperCase() + move.data.damage_class.name.slice(1)}</td>
                                      <td>{move.data.power ?? "-"}</td>
                                      <td>{move.data.accuracy ?? "-"}</td>
                                    </tr>
                                  ))}                                                           
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
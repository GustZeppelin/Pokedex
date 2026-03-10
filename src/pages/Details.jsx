import axios from "axios";
import { useSearchParams , useNavigate } from "react-router-dom";
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

    useEffect(() => {
      async function fetchData() {
        try {

          const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
          const pokemon = pokemonResponse.data;
          setData(pokemon);

          const wikiResponse = await axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${pokemon.name}`);
          setDescriptions(wikiResponse.data);

          // const abilityResponse = await axios.get(pokemon.abilities[0].ability.url);
          // setAbility(abilityResponse.data);      
          
          const abilityResponses = await Promise.all(
            pokemon.abilities.map(a => axios.get(a.ability.url))
          );

          const abilitiesData = abilityResponses.map(res => res.data);

          setAbilities(abilitiesData);

        } catch (error) {
          console.error(error);
        }
        }
      fetchData();
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
                          
                <button className="back-button" onClick={() => navigate('/')}>Back</button>
            </div>
        </div>
    )
}

export default Details
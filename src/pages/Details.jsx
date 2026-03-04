import axios from "axios";
import { useSearchParams , useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import '../css/details.css'
import '../css/type.css'

function Details() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pokemonId = searchParams.get('id');


    const [data, setData] = useState([]);
    const [descriptions, setDescriptions] = useState([]);


    // useEffect(() => {

    //   axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
    //     .then(response => setData(response.data))
    //     .catch(error => console.error(error));

    //    axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${data?.name}/`)
    //     .then(response => setDescriptions(response.data))
    //     .catch(error => console.error(error));
    // }, []);

    useEffect(() => {
      async function fetchData() {
        try {

          const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
          const pokemon = pokemonResponse.data;
          setData(pokemon);

          const wikiResponse = await axios.get(`https://pt.wikipedia.org/api/rest_v1/page/summary/${pokemon.name}`);
          setDescriptions(wikiResponse.data);
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
                      <p>Types: {data?.types[0]?.type?.name}</p>
                      <div className="">
                        {/* <span className="">{data?.types[0].type.name}</span> */}
                        {/* {data?.types?.length > 1 && (
                        <span className="{}"> {data?.types[1]?.type?.name}</span>
                      )} */}
                      </div>
                  
                    </div>
                    
                </div>
                <button className="back-button" onClick={() => navigate('/')}>Back</button>
                


            </div>
        </div>
    )
}

export default Details
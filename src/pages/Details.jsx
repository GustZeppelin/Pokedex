import axios from "axios";
import { useSearchParams ,useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Details() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pokemonId = searchParams.get('id');


    const [data, setData] = useState([]);
    useEffect(() => {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
        .then(response => setData(response.data))
        .catch(error => console.error(error));
    }, []);


    return (
        <div>
            {data && <img src={data.sprites.front_default} alt={data.name} />}
        </div>
    )
}

export default Details
// VARIABLES
let pokedex = document.getElementById('pokedex');
let pokemon = document.getElementById('pokemon');
let pokeName = document.getElementById('poke-name');
let pokeImage = document.getElementById('contenedor-poke-image');
let pokeTypes = document.getElementById('poke-types');
let pokeAbility = document.getElementById('poke-ability');
let pokeStats = document.getElementById('poke-stats');
let searchList = document.getElementById('search-list');
let searchError = document.getElementById('search-error');
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search');

const estado = {
    allPokemon: []
}
let previousType;

// FETCH DATA

//Gets a list of available pokemon 
let getAll = function () {
    fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1118')
        .then(response => response.json())
        .then(data => {
            console.log('data: ', data)

            // Fills objeto estado
            estado.allPokemon = data.results.map(function (x) {
                return x;
            })

            console.log('allPokemon: ', estado.allPokemon);
        })
        .catch(error => {
            console.error(error);
        });
};

//Gets the pokemon's data from the api
let getOne = function (id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(poke => {
            // //moves
            let pokemonAbilities = [];
            for (let i = 0; i < poke.abilities.length; i++) {
                pokemonAbilities.push(poke.abilities[i].ability.name);
            }
            fillPokedex(poke.id, poke.name, poke.sprites.front_default, pokemonAbilities, poke.stats, poke.types);
            previousType = poke.types[0].type.name;
        })
        .catch(error => {
            let searchBox = document.getElementById('search-box');
            let docFrag = document.createDocumentFragment();

            searchError.innerHTML = 'No se encontró el pokémon';
            searchList.innerHTML = '';
            docFrag.appendChild(searchList);
            docFrag.appendChild(searchError);
            searchBox.appendChild(docFrag);
            console.error(error);
        });
};

// FUNCTIONS

//Fills pokedex with the searched pokemon's data
function fillPokedex(id, name, sprite, abilities, stats, types) {
    resetPokedex();
    let docFrag = document.createDocumentFragment();
    let capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    let actualType = types[0].type.name;
    const idCorrectionFrom = 898;
    const idCorrectionSubstract = 9102;

    //Correcting id's of pokemon for showing in pokedex
    if(id > idCorrectionFrom){
        id -= idCorrectionSubstract;
    }

    pokeName.textContent = id + '.' + capitalizedName;
    pokeImage.innerHTML = `
    <img src="${sprite}" id="poke-image"></img>`;
    if (previousType != actualType) {
        pokeImage.classList.remove(previousType);
        pokeImage.classList.add(actualType);
    }
    pokeAbility.textContent = 'Ability:';
    for (let i = 0; i < abilities.length; i++) {
        pokeAbility.textContent += ` ${abilities[i]}`;
    }
    pokeStats.innerHTML = `
                <p>Base Stats: </p>
                <ul id="hp">${stats[0].stat.name}: ${stats[0].base_stat}</ul>
                <ul id="attack">${stats[1].stat.name}: ${stats[1].base_stat}</ul>
                <ul id="defense">${stats[2].stat.name}: ${stats[2].base_stat}</ul>
                <ul id="special-attack">${stats[3].stat.name}: ${stats[3].base_stat}</ul>
                <ul id="special-defense">${stats[4].stat.name}: ${stats[4].base_stat}</ul>
                <ul id="speed">${stats[5].stat.name}: ${stats[5].base_stat}</ul>`;
    if (types.length == 1) {
        pokeTypes.innerHTML = `
            <p>Type: ${types[0].type.name}</p>
            `;
    }
    else {
        pokeTypes.innerHTML = `
            <p>Type: ${types[0].type.name} / ${types[1].type.name}</p>
            `;
    }

    docFrag.appendChild(pokeName);
    docFrag.appendChild(pokeImage);
    docFrag.appendChild(pokeTypes);
    docFrag.appendChild(pokeAbility);
    docFrag.appendChild(pokeStats);
    pokemon.appendChild(docFrag);
};

//Resets pokedex nodes
function resetPokedex() {
    pokedex.classList.add('pokedex');
    pokemon.classList.add('pokemon');
    pokeName.classList.add('poke-name');
    pokeImage.classList.add('poke-image');

    let docFrag = document.createDocumentFragment();

    pokeName.textContent = '';
    pokeImage.innerHTML = '<img src=""></img>';
    pokeTypes.textContent = '';
    pokeStats.textContent = '';
    pokeAbility.textContent = '';
    searchError.textContent = '';

    docFrag.appendChild(pokeName);
    docFrag.appendChild(pokeImage);
    docFrag.appendChild(pokeTypes);
    docFrag.appendChild(pokeAbility);
    docFrag.appendChild(pokeStats);
    pokemon.appendChild(docFrag);
}

//Displays search bar results
function displaySearch(pokes) {
    searchError.innerText = '';
    if(pokes != ''){
        let pokesToShow = [];
        if(pokes.length > 20){
            for(let i = 0; i < 20; i++){
                pokesToShow.push(pokes[i])
            }                        
        }
        // console.log('pokesToShow: ',pokesToShow)
        let html = pokes.map((poke) => {
            return `<p>${poke.name}</p>`;
            // `<ul>
            //     <button id="poke-btn" class="poke-btn">${poke.name}</button>
            // </ul>`
        })
            .join(' ');        
        searchList.innerHTML = html;
    }
    else{
        searchList.innerHTML = '';
    }
}

//EVENTS
searchBar.addEventListener('keyup', (e) => {
    let searchString = e.target.value.toLowerCase();
    console.log(searchString);
    let filterPokemon = estado.allPokemon.filter((charcacter) => {
        return charcacter.name.toLowerCase().includes(searchString);
    })
    displaySearch(filterPokemon);
    if (e.target.value == '') {
        displaySearch('');
    }

    //excecute search when enter is pressed
    if(e.keyCode == 13){
        searchBtn.click();
    }
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let searchInput = document.getElementById('search-input');
    getOne(searchInput.value.toLowerCase());
})

getAll();
getOne(1);


//IIFE
var pokemonRepository = (function () {
  var repository = [];
  var modalContainer = document.querySelector('#modal-container');
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    //adds Pokemon object to pokemonList array
  function add (pokemon) {
      repository.push(pokemon);
    }

    //getAll should return all items in pokemonList array
  function getAll() {
    return repository;
    }

  //Creates a button for pokemonList object and appends that button to the button list
  function addListItem(pokemon) {
  var pokemonList = document.querySelector('.pokemon-list');
  var listItem = document.createElement('li');
  var button = document.createElement('button');
  button.innerText = pokemon.name;
  button.addEventListener('click', function (event) {
    showDetails(pokemon);
  })
  button.classList.add('pokemon-button');
  listItem.appendChild(button);
  pokemonList.appendChild(listItem);
  }

  //Call loadDetails to fetch additional details about pokemon object and logs it to the console
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

//fetches data from API and uses it to populate pokemonList array
function loadList() {
      return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      }).catch(function (error) {
        console.error(error);
      })
    }

//fetches additional details using details URL of the provided pokemon object then adds them to it
    function loadDetails(item) {
        var url = item.detailsUrl;
        return fetch(url).then(function (response) {
          return response.json();
        }).then(function (details) {
          // Add details to the item
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.weight = details.weight;
          item.types = [];
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
        }).catch(function (e) {
          console.error(e);
        });
      }

//Modal functions go here.

function showModal(item) {
  // Clear all existing modal content
  modalContainer.innerHTML = '';

  var modal = document.createElement('div');
  modal.classList.add('modal');

  //create Close button
  var closeButtonElement = document.createElement('button');
  closeButtonElement.classList.add('modal-close');
  closeButtonElement.innerText='Close';
  closeButtonElement.addEventListener('click', hideModal);

  //create Element for name
  var nameElement = document.createElement('h1');
  nameElement.innerText = 'Name: ' + item.name;

  //create Element for height
  var heightElement = document.createElement('p');
  heightElement.innerText = 'Height: ' + item.height + 'm';

  //create Element for Weight
  var weightElement = document.createElement('p');
    weightElement.innerText = 'Weight : ' + item.weight + 'kg';

    // Create element for type in modal content
    var typesElement = document.createElement('p');
    typesElement.innerText = 'Types : ' + item.types;

  //create Element for image
  var imageElement = document.createElement('img');
      imageElement.classList.add('modal-img');
      imageElement.setAttribute('src', item.imageUrl);

  modal.appendChild(closeButtonElement);
  modal.appendChild(nameElement);
  modal.appendChild(heightElement);
  modal.appendChild(weightElement);
  modal.appendChild(typesElement);
  modal.appendChild(imageElement);
  modalContainer.appendChild(modal);

  modalContainer.classList.add('is-visible');
    }

  //hides modal when close is clicked
  function hideModal() {
      modalContainer.classList.remove('is-visible');
    }
//closes modal with close button
    document.querySelector('#show-modal').addEventListener('click', () => {
      showModal('Modal title', 'This is the modal content!');
    });

//closes modal with escape
window.addEventListener('keydown', (e)=> {
    var modalContainer = document.querySelector('#modal-container');
  if(
    e.key==='Escape' &&
    modalContainer.classList.contains('is-visible')
  ){
    hideModal();
  }
});

//hides modal if clicked outside of it
var modalContainer = document.querySelector('#modal-container');
modalContainer.addEventListener('click', e => {
  var target = e.target;
  if (target === modalContainer) {
    hideModal();
  }
});
      // THE RETURN STATEMENT HERE
  return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
        showModal: showModal,
        hideModal: hideModal
      };
  })();

 pokemonRepository.loadList().then(function() {
   // Now the data is loaded!
   pokemonRepository.getAll().forEach(function(pokemon){
     pokemonRepository.addListItem(pokemon);
   });
 });

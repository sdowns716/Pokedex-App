//IIFE//
var pokemonRepository = (function () {
  var repository = [];
  var $modalContainer = $('#modal-container');
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
  var $pokemonList = $('.pokemon-list');
  var $listItem = $('<li>');
  var $button = $('<button type="button" class="pokemon-button btn btn-primary"> ' + pokemon.name + '</button>');
  $button.click(function() {
			showDetails(pokemon)
  });
  $listItem.append($button);
  $pokemonList.append($listItem);
  }

  //Call loadDetails to fetch additional details about pokemon object and logs it to the console
  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  //fetches data from API and uses it to populate pokemonList array
  function loadList() {
        return $.ajax(apiUrl)
        .then(function (json) {
          json.results.forEach(function (item) {
            var pokemon ={
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        }).catch(function (error) {
          /* eslint-disable no-console */
          console.error(error);
          /* eslint-enable no-console */
        });
      }

//fetches additional details using details URL of the provided pokemon object then adds them to it
function loadDetails(item) {
    var url=item.detailsUrl;
    return $.ajax(url)
    .then(function (details)  {
// Add details to the item
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.weight = details.weight;
          item.types = [];
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
        }).catch(function (e) {
          /* eslint-disable no-console */
          console.error(e)
          /* eslint-enable no-console */
        });
      }

//Modal functions go here.
function showModal(item) {

  // Clear all existing modal content
     var $modalContainer = $('#modal-container');
    $modalContainer.empty();


  var modal = $('<div class="modal"></div>');

  //create Close button
  var $closeButtonElement = $('<button class="modal-close"></button>');
  $closeButtonElement.text('Close');
  $closeButtonElement.click(hideModal);

//create Element for name
var nameElement = $('<h1>' + item.name + '</h1>');

//create Element for height
var heightElement = $('<p>' + 'Height: ' + item.height + 'm' + '</p>');

//create Element for Weight
var weightElement = $('<p>' + 'Weight: ' + item.weight + 'kg' + '</p>');

// Create element for type in modal content
var typesElement = $('<p>' + 'Types: ' + item.types + '</p>');

//create Element for image
var imageElement = $('<img class="modal-img">');
imageElement.attr('src', item.imageUrl);


modal.append(nameElement);
modal.append(heightElement);
modal.append(weightElement);
modal.append(typesElement);
modal.append(imageElement);
modal.append($closeButtonElement);
$modalContainer.append(modal);
$modalContainer.addClass('is-visible');
}

//hides modal when close is clicked
function hideModal() {
    var $modalContainer = $('#modal-container');
    $modalContainer.removeClass('is-visible');
  }

//hides modal with escape
$(window).on('keydown', e => {
   var $modalContainer = $('#modal-container');
   if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
     hideModal();
   }
 });

 // Hides modal if clicked outside of it
 $modalContainer = document.querySelector('#modal-container');
 $modalContainer.addEventListener('click', e => {
   var target = e.target;
   if (target === $modalContainer) {
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

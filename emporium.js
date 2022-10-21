/* ==================== Elements ==================== */

const $body = $('#wrapper');
const $searchInput = $('#search-input');
const $searchButton = $('#search-button');
const $resultsRow = $('#results-row');
const $weaponCard = $('#selection-container');

/*
Searches and definitions

- Search All Items by Name: 
  'https://www.bungie.net/Platform/Destiny2/Armory/Search/DestinyInventoryItemDefinition/' + string + '/?page=0'
                                                         ^ Definition                       ^ Search String

- One Weapon by Hash:
  'https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/' + hash + '/'
                                                     ^ Defintion                        ^ Hash

- List of Plug Sets:
  'https://www.bungie.net/Platform/Destiny2/Manifest/DestinyPlugSetDefinition/' + hash + '/'
                                                     ^ Defintion                  ^ Hash

- Single Plug Definition:
  'https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/' + hash + '/'
                                                     ^ Defintion                  ^ Hash
- Stat Definition:
  'https://www.bungie.net/Platform/Destiny2/Manifest/DestinyStatDefinition/' + hash + '/'
                                                     ^ Defintion                  ^ Hash

- Stat Hashes and Names
        155624089: stability
        943549884: handling
        1240592695: range
        1345609583: aim assistance
        1480404414: attack
        1885944937: no name
        1931675084: inventory size
        1935470627: power
        2714457168: airborne effectiveness
        2715839340: recoil direction
        3555269338: zoom
        3871231066: magazine
        4043523819: impact
        4188031367: reload speed
        4284893193: rounds per minute
*/

/* ==================== Functions ==================== */

function $searchByName(string, callBack) {
  $.ajax({
    url: 'https://www.bungie.net/Platform/Destiny2/Armory/Search/DestinyInventoryItemDefinition/' + string + '/?page=0',
    method: 'GET',
    timeout: 0,
    headers: {
      'X-API-Key': '098f5304c5214bd9a15ce721723bef0a',
    },
  }).done(callBack);
}

function getDisplayProperties(data) {
  console.log(data.Response.displayProperties);
  // return data.Response.displayProperties;
}

function $getDefinitions(hash, definition, callBack) {
  $.ajax({
    url: 'https://www.bungie.net/Platform/Destiny2/Manifest/' + definition + '/' + hash + '/',
    method: 'GET',
    timeout: 0,
    headers: {
      'X-API-Key': '098f5304c5214bd9a15ce721723bef0a',
    },
  }).done(callBack);
}

function getResultsList(data) {
  let results = [];
  for (let i = 0; i < data.Response.results.results.length; i++) {
    results.push(data.Response.results.results[i]);
  }
  console.log(results);
  $resultsRow.empty();
  for (let i = 0; i < results.length; i++) {
    generateSearchResultCard(results[i]);
  }
}

function generateSearchResultCard(result) {
  console.log(JSON.stringify(re));
  let $resultContainer = $('<div class="result-container"></div>');
  let $resultIcon = $('<img src="" class="result-icon" alt="No Image" />');
  let $resultName = $('<div class="result-name"></div>');
  $resultIcon.attr('src', 'https://www.bungie.net' + result.displayProperties.icon);
  $resultName.text(result.displayProperties.name);
  $resultContainer.append($resultIcon);
  $resultContainer.append($resultName);
  $resultContainer.attr('data--hash', result.hash);
  $resultContainer.on('click', selectResult);
  $resultsRow.append($resultContainer);
}

function generateSelectionCard(data) {
  console.log(JSON.stringify(data));
  let $selectionIcon = $('<img src="" class="result-icon" alt="No Image" />');
  $selectionIcon.attr('src', 'https://www.bungie.net' + data.Response.displayProperties.icon);
  let $selectionName = $('<div class="result-name"></div>');
  $selectionName.text(data.Response.displayProperties.name);
  let $selectionStats = $('<div class="selection-stats"></div>');
  // for (let i in data.Response.stats.stats) {
  //   let $singleSelectionStat = $('<div class="single-selection-stat"></div>');
  //   $singleSelectionStat.text('' + i + data.Response.stats.stats[i].value);
  //   $selectionStats.append($singleSelectionStat);
  // }
  let $selectionSlots = $('<div class="selection-slots"></div>');
  $selectionSlots.text('This item has ' + data.Response.sockets.socketEntries.length + 'slots.');
  $weaponCard.append($selectionIcon);
  $weaponCard.append($selectionName);
  $weaponCard.append($selectionStats);
  $weaponCard.append($selectionSlots);
  $weaponCard.show();
}

function generateItemData(data) {
  let itemData = {};
  itemData.name = data.Response.displayProperties.name;
  itemData.display = data.Response.displayProperties;
  itemData.stats = data.Response.stats.stats;
  itemData.slots = data.Response.sockets.socketEntries;
  console.log(itemData);
  return itemData;
}

function selectResult() {
  let hash = $(this).attr('data--hash');
  let definition = 'DestinyInventoryItemDefinition';
  $getDefinitions(hash, definition, generateSelectionCard);
}

/* ==================== Listeners ==================== */

$weaponCard.hide();

$searchButton.on('click', function () {
  let input = $searchInput.val();
  $weaponCard.empty();
  $weaponCard.hide();
  $searchByName(input, getResultsList);
});

/* ==================== Notes ==================== */
// This code honestly barely does anything besides parse through some thicc API calls. It would require many more calls to get stat data and slot data.

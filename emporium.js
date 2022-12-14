/* ==================== Globals ==================== */

const $body = $('#wrapper');
const $searchInput = $('#search-input');
const $searchButton = $('#search-button');
const $resultsRow = $('#results-row');
const $weaponCard = $('#selection-container');

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

function $getManifest() {
  $.ajax({
    url: 'https://www.bungie.net/Platform/Destiny2/Manifest/',
    method: 'GET',
    timeout: 0,
    headers: {
      'X-API-Key': '098f5304c5214bd9a15ce721723bef0a',
    },
  }).done((data) => {
    console.log(data);
  });
}

$getManifest();

function getDisplayProperties(data) {
  console.log(data.Response.displayProperties);
  // return data.Response.displayProperties;
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
  $resultsRow.empty();
  $weaponCard.empty();
  $getDefinitions(hash, definition, generateSelectionCard);
}

/* ==================== Listeners ==================== */

$weaponCard.hide(); // Just so when the page loads, there is no empty div

$searchButton.on('click', function () {
  let input = $searchInput.val();
  $weaponCard.empty();
  $weaponCard.hide();
  $searchByName(input, getResultsList);
});

/* ==================== Notes ==================== */
// This code honestly barely does anything besides parse through some thicc API calls. It would require many more calls to get stat data and slot data.

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

/* ==================== Example Get Response ==================== */

let responseExample = {
  Response: {
    displayProperties: {
      description: '',
      name: 'Funnelweb',
      icon: '/common/destiny2_content/icons/744408d69bc8eb8d3767ba30cf7187ac.jpg',
      hasIcon: true,
    },
    tooltipNotifications: [
      {
        displayString: '??? This weapon has active Deepsight Resonance that can be progressed.\n??? A Pattern cannot be extracted.',
        displayStyle: 'ui_display_style_info',
      },
      {
        displayString:
          '??? This weapon has Resonant Elements available to be extracted. Open the details screen of the weapon to extract.\n??? A Pattern cannot be extracted.',
        displayStyle: 'ui_display_style_info',
      },
    ],
    collectibleHash: 3247834922,
    iconWatermark: '/common/destiny2_content/icons/4fe83598190610f122497d22579a1fd9.png',
    iconWatermarkShelved: '/common/destiny2_content/icons/d05833668bcb5ae25344dd4538b1e0b2.png',
    secondaryIcon: '/common/destiny2_content/icons/33679ff3935b6b925f007181f0959d84.png',
    backgroundColor: { red: 0, green: 0, blue: 0, alpha: 0 },
    screenshot: '/common/destiny2_content/screenshots/3341893443.jpg',
    itemTypeDisplayName: 'Submachine Gun',
    flavorText: 'I penetrate all defenses.',
    uiItemDisplayStyle: '',
    itemTypeAndTierDisplayName: 'Legendary Submachine Gun',
    displaySource: 'Random Perks: This item cannot be reacquired from Collections.',
    action: {
      verbName: 'Dismantle',
      verbDescription: '',
      isPositive: false,
      requiredCooldownSeconds: 0,
      requiredItems: [],
      progressionRewards: [],
      actionTypeLabel: 'shard',
      rewardSheetHash: 0,
      rewardItemHash: 0,
      rewardSiteHash: 0,
      requiredCooldownHash: 0,
      deleteOnAction: true,
      consumeEntireStack: false,
      useOnAcquire: false,
    },
    inventory: {
      maxStackSize: 1,
      bucketTypeHash: 2465295065,
      recoveryBucketTypeHash: 215593132,
      tierTypeHash: 4008398120,
      isInstanceItem: true,
      nonTransferrableOriginal: false,
      tierTypeName: 'Legendary',
      tierType: 5,
      expirationTooltip: '',
      expiredInActivityMessage: '',
      expiredInOrbitMessage: '',
      suppressExpirationWhenObjectivesComplete: true,
    },
    stats: {
      disablePrimaryStatDisplay: false,
      statGroupHash: 4289099473,
      stats: {
        155624089: { statHash: 155624089, value: 44, minimum: 0, maximum: 0, displayMaximum: 100 },
        943549884: { statHash: 943549884, value: 70, minimum: 0, maximum: 0, displayMaximum: 100 },
        1240592695: { statHash: 1240592695, value: 39, minimum: 0, maximum: 0, displayMaximum: 100 },
        1345609583: { statHash: 1345609583, value: 54, minimum: 0, maximum: 0, displayMaximum: 100 },
        1480404414: { statHash: 1480404414, value: 0, minimum: 0, maximum: 0, displayMaximum: 100 },
        1885944937: { statHash: 1885944937, value: 0, minimum: 0, maximum: 0, displayMaximum: 100 },
        1931675084: { statHash: 1931675084, value: 45, minimum: 0, maximum: 0, displayMaximum: 100 },
        1935470627: { statHash: 1935470627, value: 0, minimum: 0, maximum: 0, displayMaximum: 100 },
        2714457168: { statHash: 2714457168, value: 20, minimum: 0, maximum: 0, displayMaximum: 100 },
        2715839340: { statHash: 2715839340, value: 96, minimum: 0, maximum: 0, displayMaximum: 100 },
        3555269338: { statHash: 3555269338, value: 14, minimum: 0, maximum: 0, displayMaximum: 100 },
        3871231066: { statHash: 3871231066, value: 36, minimum: 0, maximum: 0, displayMaximum: 100 },
        4043523819: { statHash: 4043523819, value: 15, minimum: 0, maximum: 0, displayMaximum: 100 },
        4188031367: { statHash: 4188031367, value: 31, minimum: 0, maximum: 0, displayMaximum: 100 },
        4284893193: { statHash: 4284893193, value: 900, minimum: 0, maximum: 0, displayMaximum: 100 },
      },
      hasDisplayableStats: true,
      primaryBaseStatHash: 1480404414,
    },
    equippingBlock: {
      uniqueLabelHash: 0,
      equipmentSlotTypeHash: 2465295065,
      attributes: 0,
      equippingSoundHash: 0,
      hornSoundHash: 0,
      ammoType: 1,
      displayStrings: [''],
    },
    translationBlock: {
      weaponPatternHash: 3341893443,
      defaultDyes: [
        { channelHash: 1667433279, dyeHash: 1566065105 },
        { channelHash: 1667433278, dyeHash: 1566065104 },
        { channelHash: 1667433277, dyeHash: 1566065107 },
      ],
      lockedDyes: [],
      customDyes: [],
      arrangements: [{ classHash: 0, artArrangementHash: 3341893443 }],
      hasGeometry: true,
    },
    preview: { screenStyle: 'screen_style_sockets', previewVendorHash: 0, previewActionString: '' },
    quality: {
      itemLevels: [],
      qualityLevel: 0,
      infusionCategoryName: '2806069436',
      infusionCategoryHash: 2806069436,
      infusionCategoryHashes: [2806069436],
      progressionLevelRequirementHash: 3157915980,
      currentVersion: 0,
      versions: [{ powerCapHash: 2759499571 }],
      displayVersionWatermarkIcons: ['/common/destiny2_content/icons/4fe83598190610f122497d22579a1fd9.png'],
    },
    acquireRewardSiteHash: 0,
    acquireUnlockHash: 0,
    sockets: {
      detail: 'Details',
      socketEntries: [
        {
          socketTypeHash: 3956125808,
          singleInitialItemHash: 1458010786,
          reusablePlugItems: [],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 6,
          reusablePlugSetHash: 30,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 3362409147,
          singleInitialItemHash: 1467527085,
          reusablePlugItems: [{ plugItemHash: 1467527085 }],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 2,
          randomizedPlugSetHash: 295878355,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 3815406785,
          singleInitialItemHash: 3230963543,
          reusablePlugItems: [{ plugItemHash: 3230963543 }],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 2,
          randomizedPlugSetHash: 2878144834,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 2614797986,
          singleInitialItemHash: 1428297954,
          reusablePlugItems: [{ plugItemHash: 1428297954 }],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 2,
          randomizedPlugSetHash: 2622220208,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 2614797986,
          singleInitialItemHash: 11612903,
          reusablePlugItems: [{ plugItemHash: 11612903 }],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 2,
          randomizedPlugSetHash: 3138987800,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 1288200359,
          singleInitialItemHash: 4248210736,
          reusablePlugItems: [{ plugItemHash: 195075337 }, { plugItemHash: 195075336 }, { plugItemHash: 195075339 }, { plugItemHash: 4248210736 }],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 7,
          reusablePlugSetHash: 3841308088,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 3611144110,
          singleInitialItemHash: 2323986101,
          reusablePlugItems: [
            { plugItemHash: 4003264426 },
            { plugItemHash: 299264772 },
            { plugItemHash: 4278960718 },
            { plugItemHash: 634781242 },
            { plugItemHash: 1225726778 },
            { plugItemHash: 1525622117 },
            { plugItemHash: 1710791394 },
            { plugItemHash: 3789184904 },
            { plugItemHash: 3018373291 },
          ],
          preventInitializationOnVendorPurchase: true,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 7,
          reusablePlugSetHash: 1179945069,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 2218962841,
          singleInitialItemHash: 518224747,
          reusablePlugItems: [
            { plugItemHash: 1590375901 },
            { plugItemHash: 1590375902 },
            { plugItemHash: 1590375903 },
            { plugItemHash: 1590375896 },
            { plugItemHash: 1590375897 },
            { plugItemHash: 1590375898 },
            { plugItemHash: 1590375899 },
            { plugItemHash: 1590375892 },
            { plugItemHash: 1590375893 },
            { plugItemHash: 384158423 },
            { plugItemHash: 150943607 },
            { plugItemHash: 150943604 },
            { plugItemHash: 150943605 },
            { plugItemHash: 150943602 },
            { plugItemHash: 150943603 },
            { plugItemHash: 150943600 },
            { plugItemHash: 150943601 },
            { plugItemHash: 150943614 },
            { plugItemHash: 150943615 },
            { plugItemHash: 2697220197 },
            { plugItemHash: 518224747 },
            { plugItemHash: 518224744 },
            { plugItemHash: 518224745 },
            { plugItemHash: 518224750 },
            { plugItemHash: 518224751 },
            { plugItemHash: 518224748 },
            { plugItemHash: 518224749 },
            { plugItemHash: 518224738 },
            { plugItemHash: 518224739 },
            { plugItemHash: 186337601 },
            { plugItemHash: 1486919755 },
            { plugItemHash: 1486919752 },
            { plugItemHash: 1486919753 },
            { plugItemHash: 1486919758 },
            { plugItemHash: 1486919759 },
            { plugItemHash: 1486919756 },
            { plugItemHash: 1486919757 },
            { plugItemHash: 1486919746 },
            { plugItemHash: 1486919747 },
            { plugItemHash: 3486498337 },
            { plugItemHash: 4283235143 },
            { plugItemHash: 4283235140 },
            { plugItemHash: 4283235141 },
            { plugItemHash: 4283235138 },
            { plugItemHash: 4283235139 },
            { plugItemHash: 4283235136 },
            { plugItemHash: 4283235137 },
            { plugItemHash: 4283235150 },
            { plugItemHash: 4283235151 },
            { plugItemHash: 758092021 },
            { plugItemHash: 3928770367 },
            { plugItemHash: 3928770364 },
            { plugItemHash: 3928770365 },
            { plugItemHash: 3928770362 },
            { plugItemHash: 3928770363 },
            { plugItemHash: 3928770360 },
            { plugItemHash: 3928770361 },
            { plugItemHash: 3928770358 },
            { plugItemHash: 3928770359 },
            { plugItemHash: 3803457565 },
            { plugItemHash: 4105787909 },
            { plugItemHash: 4105787910 },
            { plugItemHash: 4105787911 },
            { plugItemHash: 4105787904 },
            { plugItemHash: 4105787905 },
            { plugItemHash: 4105787906 },
            { plugItemHash: 4105787907 },
            { plugItemHash: 4105787916 },
            { plugItemHash: 4105787917 },
            { plugItemHash: 1154004463 },
            { plugItemHash: 3353797898 },
            { plugItemHash: 3353797897 },
            { plugItemHash: 3353797896 },
            { plugItemHash: 3353797903 },
            { plugItemHash: 3353797902 },
            { plugItemHash: 3353797901 },
            { plugItemHash: 3353797900 },
            { plugItemHash: 3353797891 },
            { plugItemHash: 3353797890 },
            { plugItemHash: 3128594062 },
            { plugItemHash: 2203506848 },
            { plugItemHash: 2203506851 },
            { plugItemHash: 2203506850 },
            { plugItemHash: 2203506853 },
            { plugItemHash: 2203506852 },
            { plugItemHash: 2203506855 },
            { plugItemHash: 2203506854 },
            { plugItemHash: 2203506857 },
            { plugItemHash: 2203506856 },
            { plugItemHash: 1639384016 },
            { plugItemHash: 892374263 },
            { plugItemHash: 892374260 },
            { plugItemHash: 892374261 },
            { plugItemHash: 892374258 },
            { plugItemHash: 892374259 },
            { plugItemHash: 892374256 },
            { plugItemHash: 892374257 },
            { plugItemHash: 892374270 },
            { plugItemHash: 892374271 },
            { plugItemHash: 2993547493 },
          ],
          preventInitializationOnVendorPurchase: true,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 3,
          reusablePlugSetHash: 1117738936,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 3993098925,
          singleInitialItemHash: 3988215619,
          reusablePlugItems: [],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 6,
          reusablePlugSetHash: 1074,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 1282012138,
          singleInitialItemHash: 2285418970,
          reusablePlugItems: [],
          preventInitializationOnVendorPurchase: true,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 6,
          reusablePlugSetHash: 5,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
        {
          socketTypeHash: 0,
          singleInitialItemHash: 0,
          reusablePlugItems: [],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 1,
          overridesUiAppearance: false,
          defaultVisible: false,
        },
        {
          socketTypeHash: 0,
          singleInitialItemHash: 0,
          reusablePlugItems: [],
          preventInitializationOnVendorPurchase: false,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 1,
          overridesUiAppearance: false,
          defaultVisible: false,
        },
        {
          socketTypeHash: 1085237186,
          singleInitialItemHash: 1961918267,
          reusablePlugItems: [{ plugItemHash: 1791833453 }],
          preventInitializationOnVendorPurchase: true,
          preventInitializationWhenVersioning: false,
          hidePerksInItemTooltip: false,
          plugSources: 3,
          reusablePlugSetHash: 503622563,
          overridesUiAppearance: false,
          defaultVisible: true,
        },
      ],
      intrinsicSockets: [{ plugItemHash: 3690882495, socketTypeHash: 2160514589, defaultVisible: true }],
      socketCategories: [
        { socketCategoryHash: 3956125808, socketIndexes: [0] },
        { socketCategoryHash: 4241085061, socketIndexes: [1, 2, 3, 4, 8, 9] },
        { socketCategoryHash: 2048875504, socketIndexes: [5] },
        { socketCategoryHash: 2685412949, socketIndexes: [6, 7, 12] },
      ],
    },
    talentGrid: { talentGridHash: 521135891, itemDetailString: 'Details', hudDamageType: 1 },
    investmentStats: [
      { statTypeHash: 1480404414, value: 0, isConditionallyActive: false },
      { statTypeHash: 1935470627, value: 0, isConditionallyActive: false },
      { statTypeHash: 1885944937, value: 0, isConditionallyActive: false },
      { statTypeHash: 3555269338, value: 14, isConditionallyActive: false },
      { statTypeHash: 4284893193, value: 100, isConditionallyActive: false },
      { statTypeHash: 4043523819, value: 0, isConditionallyActive: false },
      { statTypeHash: 1240592695, value: 39, isConditionallyActive: false },
      { statTypeHash: 155624089, value: 44, isConditionallyActive: false },
      { statTypeHash: 3871231066, value: 65, isConditionallyActive: false },
      { statTypeHash: 4188031367, value: 31, isConditionallyActive: false },
      { statTypeHash: 1931675084, value: 45, isConditionallyActive: false },
      { statTypeHash: 943549884, value: 70, isConditionallyActive: false },
      { statTypeHash: 1345609583, value: 54, isConditionallyActive: false },
      { statTypeHash: 2715839340, value: 96, isConditionallyActive: false },
      { statTypeHash: 2714457168, value: 20, isConditionallyActive: false },
    ],
    perks: [{ requirementDisplayString: '', perkHash: 279556661, perkVisibility: 0 }],
    summaryItemHash: 3520001075,
    allowActions: true,
    doesPostmasterPullHaveSideEffects: false,
    nonTransferrable: false,
    itemCategoryHashes: [3, 1, 3954685534],
    specialItemType: 0,
    itemType: 3,
    itemSubType: 24,
    classType: 3,
    breakerType: 0,
    equippable: true,
    damageTypeHashes: [3454344768],
    damageTypes: [4],
    defaultDamageType: 4,
    defaultDamageTypeHash: 3454344768,
    isWrapper: false,
    traitIds: ['foundry.veist', 'item_type.weapon', 'weapon_type.submachinegun'],
    traitHashes: [963390771, 4021177463, 1117493175],
    hash: 3341893443,
    index: 12063,
    redacted: false,
    blacklisted: false,
  },
  ErrorCode: 1,
  ThrottleSeconds: 0,
  ErrorStatus: 'Success',
  Message: 'Ok',
  MessageData: {},
};

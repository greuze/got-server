var aThroneOfBlades = {
    name: 'A Throne of Blades',
    text: 'The holder of the Iron Throne token chooses whether a) everyone updates their Supply, ' +
        'then reconcile armies b) everyone musters units, or c) this card has no effect.',
    advanceWildlings: true
};
var clashOfKings = {
    name: 'Clash of Kings',
    text: 'Bid on the three Influence tracks.',
};
var darkWingsDarkWords = {
    name: 'Dark Wings, Dark Words',
    text: 'The holder of the Messenger Raven chooses whether a) everyone bids on the three Influence ' +
        'tracks b) everyone collects one Power token for every power icon present in areas they control, ' +
        'or c) this card has no effect.',
    advanceWildlings: true
};
var feastForCrows = {
    name: 'Feast for Crows',
    text: 'Consolidate Power Orders cannot be played during this Planning Phase.',
    advanceWildlings: true
};
var gameOfThrones = {
    name: 'Game of Thrones',
    text: 'Each player collects one Power token for each power icon present in areas he controls.'
};
var lastDaysOfSummer = {
    name: 'Last Days of Summer',
    text: 'Nothing happens.',
    advanceWildlings: true
};
var mustering = {
    name: 'Mustering',
    text: 'Recruit new units in Strongholds and Castles.'
};
var putToTheSword = {
    name: 'Put to the Sword',
    text: 'The holder of the Valyrian Steel Blade chooses one of the following conditions for this Planning ' +
        'Phase: a) Defense Orders cannot be played b) March +1 Orders cannot be played, or c) no restrictions.',
};
var rainsOfAutumn = {
    name: 'Rains of Autum',
    text: 'March +1 Orders cannot be played this Planning Phase.',
    advanceWildlings: true
};
var seaOfStorms = {
    name: 'Sea of Storms',
    text: 'Raid Orders cannot be played during this Planning Phase.',
    advanceWildlings: true
};
var stormOfSwords = {
    name: 'Storm of Swords',
    text: 'Defense Orders cannot be played during this Planning Phase.',
    advanceWildlings: true
};
var supply = {
    name: 'Supply',
    text: 'Adjust Supply track. Reconcile armies.'
};
var webOfLies = {
    name: 'Web of Lies',
    text: 'Support Orders cannot be placed during this Planning Phase.',
    advanceWildlings: true
};
var wildlingsAttack = {
    name: 'Wildlings Attack',
    text: 'The wildlings attack Westeros.'
};
var winterIsComing = {
    name: 'Winter Is Coming',
    text: 'Immediately shuffle this deck. Then draw and resolve a new card.'
};

module.exports.westerosDeckI = [
    supply,
    supply,
    supply,
    mustering,
    mustering,
    mustering,
    aThroneOfBlades,
    aThroneOfBlades,
    lastDaysOfSummer,
    winterIsComing
];

module.exports.westerosDeckII = [
    clashOfKings,
    clashOfKings,
    clashOfKings,
    gameOfThrones,
    gameOfThrones,
    gameOfThrones,
    darkWingsDarkWords,
    darkWingsDarkWords,
    lastDaysOfSummer,
    winterIsComing
];

module.exports.westerosDeckIII = [
    wildlingsAttack,
    wildlingsAttack,
    wildlingsAttack,
    seaOfStorms,
    rainsOfAutumn,
    feastForCrows,
    webOfLies,
    stormOfSwords,
    putToTheSword,
    putToTheSword
];

var common = require('./common');

// Check that every zone belongs to the player, and every order is correct for that zone
module.exports.canPlaceOrders = function canPlaceOrders(game, playerId, orders) {
    // Check that current phase is PLANIFICATION and playerId is a valid user
    if (game.period.phase !== 'PLANIFICATION') {
        console.log('Planification not allowed in %s phase', game.period.phase);
        return false;
    }

    var playerHouse = game.getPlayerById(playerId);
    if (!playerHouse) {
        console.log('Player %s is not playing this game', playerId);
        return false;
    }

    // Check that player can play (depending on overlappable phases)
    var houseCanPlay = game.canPlay(playerHouse);
    if (!houseCanPlay) {
        console.log('It is not %s turn', playerHouse);
        return false;
    }

    // Check if there are more orders from a type than available
    var availableOrders = common.getAvailableOrders();
    var exhaustedOrUnknown = false;
    orders.forEach(function checkOrder(e) {
        var i = availableOrders.indexOf(e.order);
        if (i >= 0) {
            availableOrders.splice(i, 1);
        } else {
            exhaustedOrUnknown = true;
            console.log('There are not enough %s orders to place for house %s', e.order, playerHouse);
        }
    });
    if (exhaustedOrUnknown) {
        return false;
    }

    // Check that there are not more special orders than available for that player
    var availableStars = common.getMaxSpecialOrders(game.getKingsCourtPosition(playerHouse), game.maxPlayers);
    var usedStars = orders.filter(function filterStarred(e) {
        return e.order.indexOf('*') >= 0;
    }).length;
    if (usedStars > availableStars) {
        console.log('House %s placed %d special orders and can use only %d', playerHouse, usedStars, availableStars);
        return false;
    }

    // Check if every zone belongs to the user, and there are not duplicated
    var availableZones = game.getPlanificableZonesByHouse(playerHouse);
    var invalidZone = false;
    orders.forEach(function checkZone(e) {
        var i = availableZones.indexOf(e.zone);
        if (i >= 0) {
            availableZones.splice(i, 1);
        } else {
            invalidZone = true;
            console.log('Cannot place order %s in %s for house %s', e.order, e.zone, playerHouse);
        }
    });
    if (invalidZone) {
        return false;
    }

    return true;
};

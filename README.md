# Games of Thrones (board game) javascript server
This is a javascript server to be used as controller of an online
[Game of Thrones board game](http://www.fantasyflightgames.com/edge_minisite.asp?eidm=172),
using these [rules](http://www.fantasyflightgames.com/ffg_content/agot-bg-2nd-ed/support/VA65_AGoT2_Rulebook_web.pdf).

To play the game, the user interface will also be required (not yet done).

## API (could change without notice)

### Create/join game
```
POST /games
```
Headers:
```
content-type: application/json
```
Body:
```
{
  "maxPlayers": "<number_of_players>"
}
```
Response example:
```
HTTP/1.1 202 Accepted
{
  "gameId": "a59d0ad5-0069-4ae6-874e-d33b4f74674c",
  "playerId": "516ccdd7-bada-4278-981b-8bc6a0e89df3",
  "playerHouse":"baratheon",
  "pendingPlayers": 2
}
```

### Get info about the game
```
GET /games/<game_id>
```
Headers:
```
player-id: <player_id>
```
Response example:
```
HTTP/1.1 200 OK
{
  "gameId":"a59d0ad5-0069-4ae6-874e-d33b4f74674c",
  "playerId":"516ccdd7-bada-4278-981b-8bc6a0e89df3",
  "playerHouse":"baratheon",
  "status":"running"
}
```

### Place orders
```
PUT /games/<game_id>/orders
```

### Execute order
```
POST /games/<game_id>/orders/<order_id>
```

### Support in battle
```
PUT /games/<game_id>/order/<order_id>/support
```

### Play card in battle
```
PUT /games/<game_id>/order/<order_id>/card
```

### Muster
```
PUT /games/<game_id>/muster
```

### Use crow
```
POST /games/<game_id>/crow
```

### Bet
```
PUT /games/<game_id>/bet/<bet_id>
```

# Games of Thrones (board game) javascript server
This is a javascript server to be used as controller of an online
[Game of Thrones board game](http://www.fantasyflightgames.com/edge_minisite.asp?eidm=172),
using these [rules](http://www.fantasyflightgames.com/ffg_content/agot-bg-2nd-ed/support/VA65_AGoT2_Rulebook_web.pdf).

To play the game, the user interface will also be required (not yet done).

## API (could change without notice)

Create/join game
```
POST /games
```

Get info about the game
```
GET /games/<game_id>
```

Place orders
```
PUT /games/<game_id>/orders
```

Execute order
```
POST /games/<game_id>/orders/<order_id>
```

Support in battle
```
PUT /games/<game_id>/order/<order_id>/support
```

Play card in battle
```
PUT /games/<game_id>/order/<order_id>/card
```

Use crow
```
POST /games/<game_id>/crow
```

Bet
```
POST /games/<game_id>/bet/<bet_id>
```

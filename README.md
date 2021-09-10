# MatchMaking
NodeJS/Websocket matchmaking

# Matchmaking algo
- Match instant 2 players if their rankedLevel delta is equal or less than `instantMatchingRankedLevelDelta` option value
- Match two players after the waiting time of one user is equal or greater than `instantMatchingRankedLevelDelta` 
option value and rankedLevel delta is equal or less than `maxRankedLevelDelta` option value
- If the player waited more than `instantMatchingWaitingTime` of time, he is removed from the pool

# Installation
- `npm i --dev`

# Usage
- `npm run server` (compile and run the server on port 8999)
- open another terminal and run `npm run test-client`
- On the server terminal you can see the matched users and those that waited to long and has been removed
- On the client terminal you can see the output from client websocket

# Testing
- `npm run test`

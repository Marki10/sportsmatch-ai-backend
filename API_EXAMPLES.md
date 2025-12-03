# API Usage Examples

This document provides practical examples for using the SportsMatch AI API.

## Authentication Flow

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepass123",
    "name": "John Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepass123"
  }'
```

**Response:** Same format as registration, includes JWT token.

### 3. Save Your Token

```bash
# Save token to variable (bash)
export TOKEN="your-jwt-token-here"
```

## Teams

### Create a Team

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Manchester United",
    "country": "England",
    "foundedYear": 1878,
    "stadium": "Old Trafford"
  }'
```

### Get All Teams

```bash
curl http://localhost:3000/api/teams
```

### Get Team by ID

```bash
curl http://localhost:3000/api/teams/{team-id}
```

### Update Team

```bash
curl -X PUT http://localhost:3000/api/teams/{team-id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "stadium": "New Stadium Name"
  }'
```

### Delete Team

```bash
curl -X DELETE http://localhost:3000/api/teams/{team-id} \
  -H "Authorization: Bearer $TOKEN"
```

## Players

### Create a Player

```bash
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Cristiano Ronaldo",
    "position": "Forward",
    "age": 38,
    "teamId": "team-uuid-here",
    "goals": 850,
    "assists": 250,
    "matchesPlayed": 1200,
    "rating": 9.5
  }'
```

### Get All Players (with optional team filter)

```bash
# All players
curl http://localhost:3000/api/players

# Players by team
curl "http://localhost:3000/api/players?teamId=team-uuid-here"
```

### Get Player by ID

```bash
curl http://localhost:3000/api/players/{player-id}
```

### Update Player Stats

```bash
curl -X PUT http://localhost:3000/api/players/{player-id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "goals": 851,
    "matchesPlayed": 1201,
    "rating": 9.6
  }'
```

## Matches

### Create a Match

```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "homeTeamId": "home-team-uuid",
    "awayTeamId": "away-team-uuid",
    "date": "2024-06-15T15:00:00Z",
    "status": "scheduled"
  }'
```

**Note:** When status is "scheduled", the API automatically generates an AI prediction!

### Get All Matches

```bash
# All matches
curl http://localhost:3000/api/matches

# Filter by status
curl "http://localhost:3000/api/matches?status=scheduled"
curl "http://localhost:3000/api/matches?status=live"
curl "http://localhost:3000/api/matches?status=finished"
```

### Get Match by ID

```bash
curl http://localhost:3000/api/matches/{match-id}
```

### Get AI Prediction for Match

```bash
curl http://localhost:3000/api/matches/{match-id}/prediction
```

**Response:**
```json
{
  "success": true,
  "data": {
    "homeWinProbability": 0.45,
    "awayWinProbability": 0.35,
    "drawProbability": 0.20,
    "predictedScore": {
      "home": 2,
      "away": 1
    },
    "confidence": 0.78
  }
}
```

### Update Match Score

```bash
curl -X PUT http://localhost:3000/api/matches/{match-id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "finished",
    "homeScore": 3,
    "awayScore": 1
  }'
```

### Update Match Status

```bash
curl -X PUT http://localhost:3000/api/matches/{match-id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "live"
  }'
```

## Complete Workflow Example

```bash
# 1. Register and login
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"User"}'

# Save token from response
export TOKEN="your-token-here"

# 2. Create two teams
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Team A","country":"USA","foundedYear":2020,"stadium":"Stadium A"}'

curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Team B","country":"USA","foundedYear":2021,"stadium":"Stadium B"}'

# Save team IDs from responses
export TEAM_A_ID="team-a-uuid"
export TEAM_B_ID="team-b-uuid"

# 3. Create players
curl -X POST http://localhost:3000/api/players \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"Player 1\",\"position\":\"Forward\",\"age\":25,\"teamId\":\"$TEAM_A_ID\"}"

# 4. Create a match
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"homeTeamId\":\"$TEAM_A_ID\",\"awayTeamId\":\"$TEAM_B_ID\",\"date\":\"2024-12-31T20:00:00Z\"}"

# Save match ID
export MATCH_ID="match-uuid"

# 5. Get AI prediction
curl http://localhost:3000/api/matches/$MATCH_ID/prediction

# 6. Update match with final score
curl -X PUT http://localhost:3000/api/matches/$MATCH_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"finished","homeScore":2,"awayScore":1}'
```

## Using JavaScript/TypeScript

```typescript
const API_BASE = 'http://localhost:3000';

// Login
const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// Create team
const teamResponse = await fetch(`${API_BASE}/api/teams`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'New Team',
    country: 'USA',
    foundedYear: 2024,
    stadium: 'New Stadium'
  })
});

const team = await teamResponse.json();
console.log(team);
```

## Using Postman

1. Import the API base URL: `http://localhost:3000`
2. Create an environment variable `token` for your JWT
3. Set up an auth request to get the token
4. Use the token in the Authorization header: `Bearer {{token}}`

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "details": []  // Optional validation details
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

Happy coding! 🚀

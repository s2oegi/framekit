# Matcher - card game for everybody

Music memory card game: match artists with their hit songs.

## Flow

1. **Continent:** Europe / Asia / North America / South America / Africa
2. **Country:** filtered by continent (133 countries)
3. **Theme:** Mix / Pop / Rap / Rock / Indie
4. **Difficulty:** Easy (6), Medium (8), Hard (12)

Default UI language is English. The bottom bar shows a flag for every playable country; clicking a flag switches to that country’s UI language (`COUNTRY_LANG`).

## Run

```bash
python3 -m http.server 5173
```

Then open: http://localhost:5173

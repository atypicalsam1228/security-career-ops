# Score Distribution

## All Applications by Score

```dataview
TABLE company, role, status, archetype
FROM "Applications"
SORT score DESC
```

## Top Matches (4.0+)

```dataview
LIST company + " — " + role + " (" + score + "/5)"
FROM "Applications"
WHERE score >= 4.0
SORT score DESC
```

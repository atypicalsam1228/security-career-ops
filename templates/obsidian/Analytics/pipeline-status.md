# Pipeline Status

```dataview
TABLE score, status, archetype, date
FROM "Applications"
WHERE status != "SKIP"
SORT status ASC, score DESC
```

## By Status

```dataview
TABLE length(rows) AS Count
FROM "Applications"
GROUP BY status
SORT length(rows) DESC
```

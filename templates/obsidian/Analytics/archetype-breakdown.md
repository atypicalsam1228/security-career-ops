# Archetype Breakdown

```dataview
TABLE length(rows) AS Count, round(average(rows.score), 1) AS "Avg Score"
FROM "Applications"
GROUP BY archetype
SORT length(rows) DESC
```

## Top Scores by Archetype

```dataview
TABLE score, company, role, status
FROM "Applications"
WHERE score >= 4.0
SORT archetype ASC, score DESC
```

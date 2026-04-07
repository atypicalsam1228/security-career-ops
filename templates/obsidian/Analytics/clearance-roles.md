# Clearance-Required Roles

```dataview
TABLE score, status, company, archetype
FROM "Applications"
WHERE clearance_required = true
SORT score DESC
```

## Non-Clearance Roles

```dataview
TABLE score, status, company, archetype
FROM "Applications"
WHERE clearance_required = false
SORT score DESC
```

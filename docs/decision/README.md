# Decision records

Use a short decision record for architectural choices with lasting consequences: ownership, public contracts, persistence, dependencies, deployment, or a meaningful tradeoff. Keep implementation instructions in the relevant guide.

## Creating a record

1. Copy [0000-template.md](0000-template.md) to `NNNN-short-title.md`, starting at `0001`.
2. Use the next available four-digit number; never reuse or renumber a record.
3. Replace the title, date, metadata, and prompts. Keep one decision per file.
4. Explain the problem, chosen approach, reasons, alternatives, and consequences. Link relevant code, issues, or earlier decisions.
5. Commit the accepted record with the change that implements it, and update affected guides.

`0000-template.md` is a scaffold, not an accepted decision. Drafts can be discussed in a pull request; the stored record uses one of the statuses below.

## Statuses

| Status       | Meaning                                                | Update                                                                                                       |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `accepted`   | The decision applies to current work.                  | Keep its reasoning and consequences available.                                                               |
| `superseded` | A newer decision replaces it.                          | Set `superseded_by` to the replacement filename and add this filename to the new record's `supersedes` list. |
| `deprecated` | The decision no longer applies and has no replacement. | Leave `superseded_by` as `null` and explain why it was retired.                                              |

Read accepted records before changing their subject. When replacing or retiring a decision, preserve the original context and reasoning; update status, replacement links, and status history. Do not delete old records. Use the history date for status changes; `date` remains the original acceptance date.

Replacement references use filenames relative to this directory. Add clickable links in the status history or context so readers can follow the chain.

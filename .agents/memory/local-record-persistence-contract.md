---
name: Local record persistence contract
description: The durable event shape required for local workflow records to remain consistent across views and reloads.
---

Every user-created local workflow record should be persisted as a `local_record_saved` event with its reference and status in the payload. Success screens may render the server response, while Activity, receipts, and transaction details must derive their display from that same persisted event.

**Why:** A display-only success record can show a reference that is missing or different after a reload, making the workspace record impossible to reconcile.

**How to apply:** When adding or changing a local workflow, update the API validation and persistence check together; do not rely on a toast or client-only object as the source of truth.
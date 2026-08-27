---
name: GitHub sync connector behavior
description: Notes on using the authorized GitHub connector for repository synchronization in this workspace.
---

The authorized GitHub connector can read repository refs and upload ordinary file contents, but Git-data tree/commit operations may fail with a connector serialization or proxy error after blobs are created. Prefer small, isolated contents updates when synchronization is required, and verify the branch ref after every write.

**Why:** Repository synchronization encountered intermittent 403 and callback-validation failures even though authentication and individual blob uploads worked.

**How to apply:** Do not assume a failed tree/commit callback changed the branch; always read `refs/heads/main` before reporting success.
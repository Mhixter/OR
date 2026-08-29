---
name: GitHub sync connector behavior
description: Notes on using the authorized GitHub connector for repository synchronization in this workspace.
---

The authorized GitHub connector can read repository refs and upload ordinary file contents, but Git-data tree/commit operations may fail with a connector serialization or proxy error after blobs are created. Contents writes can also partially apply before a later path is blocked by Cloudflare; in this workspace, HTML entry-file writes are especially prone to that block. Prefer small, isolated writes and verify the branch ref plus every target file after each write. If an entry HTML path is blocked, preserving the existing hashed bundle paths and overwriting those bundle contents can keep the remote static build coherent while leaving the old HTML untouched.

**Why:** Repository synchronization encountered intermittent 403 and callback-validation failures even though authentication and individual blob uploads worked.

**How to apply:** Do not assume a failed tree/commit or contents callback changed nothing; always read `refs/heads/main` and each target file before reporting success. Avoid deleting remote bundle paths until the remote HTML has been updated successfully.
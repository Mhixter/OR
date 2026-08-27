---
name: Stylesheet import order
description: A project-specific caution for maintaining the compact stylesheet without introducing build warnings.
---

Keep any CSS `@import` declarations before all regular rules when editing the compact stylesheet.

**Why:** Appending a new rule block ahead of the existing import makes PostCSS warn that the import is out of order, even though the production bundle can still build.

**How to apply:** When adding CSS overrides, preserve the import at the top of the file and verify `npm run build` remains warning-free.
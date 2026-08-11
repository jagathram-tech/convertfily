## 2024-05-24 - Output Truncation Mitigation for Code Reading
**Learning:** Tools like `read_file` or simple `grep` commands might be truncated or fail to capture multiline structures (like long arrays or sets inside functions).
**Action:** Use an inline Node.js script via bash to slice specific line ranges and output them if standard tools hit truncation limits. Ensure the correct context is available before executing replacements.

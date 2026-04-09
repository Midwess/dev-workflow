# Tasks: support-gemini

## Progress: [0/9]

## 1. Confirm Runtime Packaging

- [ ] 1.1 Identify the required Gemini metadata, registration, and packaging contract
- [ ] 1.2 Decide whether Gemini support lives in `plugins/dev-workflow/.gemini-plugin/` or requires a separate runtime root

## 2. Complete Gemini Runtime Assets

- [ ] 2.1 Inventory the existing files under `plugins/dev-workflow/.gemini-plugin/`
- [ ] 2.2 Add or validate the Gemini-specific metadata/configuration files required by the runtime
- [ ] 2.3 Add or adapt the Gemini hook prompts/scripts needed for the supported workflow surface

## 3. Update Documentation And Guidance

- [ ] 3.1 Update `README.md` with Gemini runtime support and setup guidance
- [ ] 3.2 Update `plugins/dev-workflow/README.md` to describe Gemini asset layout and support boundaries
- [ ] 3.3 Update `CONTRIBUTING.md` and `CLAUDE.md` with Gemini maintenance and testing expectations

## 4. Verification

- [ ] 4.1 Verify Gemini-referenced paths and config files are present and internally consistent
- [ ] 4.2 Review docs for explicit Gemini parity and limitation language

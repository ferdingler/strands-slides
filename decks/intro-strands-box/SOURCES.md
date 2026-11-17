# Source notes

Slides 8–9 present the `box` CLI (staging-boxy, local checkout `~/workplace/staging-boxy`, commit `9f4d705`) rather than the blog's Box Core `box.toml` workflow.

This deck follows the story of **“Introducing Strands Box: AI agent sandboxes
powered by Dogwood”** by Fernando Dingler, AWS Open Source Blog, October 7, 2026:
https://aws.amazon.com/blogs/opensource/introducing-strands-box-ai-agent-sandboxes-powered-by-dogwood/

| Slide | Blog material |
| --- | --- |
| 1 — Strands Box | Launch: developer preview, Apache 2.0, built on Dogwood and the Dogwood Local Engine. |
| 2 — Agents act without review | Opening: agents read files, run commands, call APIs, often in “YOLO mode.” |
| 3 — Isolation limits reach, not behavior | Incident agent that may read logs but not change infrastructure. |
| 4 — Contain, then govern | “Inside Strands Box”: OS containment plus four enforcement points sharing one history. |
| 5 — Judge the effect, not the call | “Why interpreters?” (`rm -rf build/` → per-file `fs:delete`) and “Why not the harness's own permissions?” |
| 6 — Secrets never enter the box | Egress gateway credential injection and the supported auth methods. |
| 7 — Temporal policies | “Temporal policies”: the Slack cap of three posts per 10 minutes and its example timeline. |
| 8 — Every decision, in OpenTelemetry | Box Core `docs/design/telemetry.md`: every effective decision recorded as an OTLP span and log, plus relayed agent OTEL data. The record line is an illustrative summary. |
| 9 — Deploy anywhere | Blog “What's next”: package custom agents (Strands, LangChain, Claude Agent SDK) with Box and deploy them; targets per Fernando: AgentCore Runtime, EKS, EC2, on-premises. |
| 10 — Your agent, in a box | `box profile create` / `box run` from the staging-boxy `README.md` and `docs/user/cli.md`; starters Claude Code, Codex, Kiro CLI, pi. Blog “What's next” is in the notes. |

## Scope notes

- Slide 4 omits a caveat kept in the notes: paths granted directly in `box.toml`
  are bounded by containment only and do not appear in policy history.
- Slide 5's file names under `build/` are illustrative.
- Slide 7's timeline matches the blog's table. The rule counts 200 responses, so
  refused attempts do not count toward the cap.

## Visual style

Black, `#00cc60`, white, and `#a78bfa`; JetBrains Mono for headings and code,
Space Grotesk for body text. Font licenses are in `public/fonts/`. Diagrams are
original simplifications. `AGENTS.md` at the repository root defines slide density.

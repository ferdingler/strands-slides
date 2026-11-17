# Source notes

Prepared November 17, 2026, from the Strands Box website and local Box checkout.
The deck presents Box capabilities, with an illustrative temporal rule on slide 3.
It does not claim benchmark results or microVM-equivalent isolation.

| Slide | Sources | Claim and scope |
| --- | --- | --- |
| 1 — Strands Box | Box `README.md`, Overview and Architecture | Open source; host OS isolation plus Dogwood; enforcement outside the agent. |
| 2 — A sandbox without a microVM | `docs/design/architecture.md`, “The boundary is the operating system’s own sandboxing”; `docs/design/platform-differences.md`; `crates/containment/README.md` | No guest OS; Linux namespaces and seccomp; macOS Seatbelt. The architecture docs explicitly say a microVM provides stronger isolation and a kernel escape defeats OS enforcement. |
| 3 — Make history part of permission | `README.md`, Overview and Key capabilities; `docs/user/policy.md`; `docs/user/security.md` | Operations, arguments, earlier events, and time can affect permission. The ten-minute rule is illustrative, not a shipped default. It depends on completed reads through Shell or Monty and outbound requests through the gateway. Direct file grants do not feed individual policy decisions into this history. |
| 4 — One policy across code and tools | `README.md`, Architecture and Key capabilities; `docs/user/security.md`, “The two tiers”; `docs/user/policy.md`, “How a denial reads” | Shared engine/history, gateway credential injection, and policy decision records. The logs are not a complete syscall trace. |
| 5 — Bring your agent | Website quickstart; `README.md`; `examples/claude-code/README.md`; `examples/codex-cli/README.md` | Config and policy workflow, harness examples, preview platforms. Agent integration may require proxy and tool configuration. |

Website: https://strandsagents.com/docs/user-guide/box/quickstart/

Repository: https://github.com/strands-agents/box

Local checkout used: `/local/home/fdingler/workplace/box`, commit `d5278f29`.

Browser-computed styles on the live website use JetBrains Mono for headings
(weight 600) and Space Grotesk for body text (weight 400). The deck bundles the same
Latin variable font files served to the website by Google Fonts, with weights
400–700. A Figtree stylesheet link is present on the site but does not set the
active heading or body font. The requested palette is applied in `style.css`.
The cube drawing is an original decorative diagram, not a Strands logo.

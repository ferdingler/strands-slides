# Source notes

This deck adapts the concepts and narrative of **“Strands Box: The Big Picture”**
by Marc Brooker, published October 7, 2026, and read November 17, 2026:
https://strandsagents.com/blog/strands-box-the-big-picture/

| Slide | Blog material | Adaptation |
| --- | --- | --- |
| 1 — Strands Box | Product introduction and the tension between tight and loose boundaries. | Uses the requested product title and subheading; the autonomy discussion is in speaker notes. |
| 2 — Policy can depend on history | Semantic-policy motivation and the code-push example. | Shows one policy timeline; the MCP quota and payments examples remain in speaker notes. |
| 3 — Choose the right level of meaning | “There are many ways to build a sandbox.” | Uses a diagram to compare information visible at device, syscall, and semantic layers. This is not a security ranking. |
| 4 — Native isolation. External policy. | Architecture discussion and the two-pronged isolation/policy design. | Shows the logical flow of mediated requests through trusted Box enforcement. |
| 5 — Pair policy with tenant isolation | “There is no free lunch” and “The bigger picture.” | Shows a microVM for each agent session; trusted-code tradeoffs and the demo handoff are in speaker notes. |

## Scope of the examples

The push example is illustrative. The blog's rule requires a successful `npm test`
in the project within 15 minutes, with no later `git add`; it does not prove that
all code being pushed was tested. The blog names `git switch` as a counterexample.
The MCP quota counts `tools/call` request events, including refused attempts, not
only successful calls. Speaker notes preserve these qualifications.

The architecture slide depicts mediated requests. Its speaker notes qualify the
blog's “only way out” description: direct filesystem grants are OS-enforced and
do not produce per-operation Dogwood checks.
This follows the Box repo's `docs/user/security.md`, “The two tiers,” and `README.md`.
Local checkout: `/local/home/fdingler/workplace/box`, commit `d5278f29`.

The final slide's notes propose a demo sequence; they do not claim a live agent
workload has already been configured. The blog's wider discussion of AWS investment,
AgentCore Policy, gVisor, and policy-authoring work is retained in presenter notes.

## Visual style

The palette follows Fernando's requested black, `#00cc60`, white, and `#a78bfa`.
The bundled fonts match browser-computed styles on the website: JetBrains Mono
for headings and code, and Space Grotesk for body text. Font licenses are in
`public/fonts/`. Diagrams are original simplifications for this talk.
The repository's `AGENTS.md` defines the slide density and visual guidance.

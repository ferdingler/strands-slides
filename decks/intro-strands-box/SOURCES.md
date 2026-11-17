# Source notes

This deck adapts the concepts and narrative of **“Strands Box: The Big Picture”**
by Marc Brooker, published October 7, 2026, and read November 17, 2026:
https://strandsagents.com/blog/strands-box-the-big-picture/

| Slide | Blog material | Adaptation |
| --- | --- | --- |
| 1 — Agents need room to solve problems | Opening discussion: why agents need autonomy, and the tension between tight and loose boundaries. | Establishes the problem before introducing implementation. |
| 2 — Policies should describe the work | Semantic-policy motivation and the two Dogwood examples. | Summarizes the push precondition and hourly MCP quota in plain language. |
| 3 — Rich policy needs the right view | “There are many ways to build a sandbox.” | Compares information visible at device, syscall, and semantic layers. This is not a security ranking. |
| 4 — Contain with the OS. Decide in Box. | Architecture discussion and the two-pronged isolation/policy design. | Shows native containment and the trusted components that expose operations to Dogwood. |
| 5 — Semantic control + strong isolation | “There is no free lunch” and “The bigger picture.” | Explains the trusted-code tradeoff and the recommendation to pair Box with a per-session microVM in multi-tenant cloud deployments. Ends with a live-demo handoff. |

## Scope of the examples

The push example is illustrative. The blog's rule requires a successful `npm test`
in the project within 15 minutes, with no later `git add`; it does not prove that
all code being pushed was tested. The blog names `git switch` as a counterexample.
The MCP quota counts `tools/call` request events, including refused attempts, not
only successful calls. Speaker notes preserve these qualifications.

The architecture slide qualifies the blog's “only way out” description: direct
filesystem grants are OS-enforced and do not produce per-operation Dogwood checks.
This follows the Box repo's `docs/user/security.md`, “The two tiers,” and `README.md`.
Local checkout: `/local/home/fdingler/workplace/box`, commit `d5278f29`.

The final slide proposes a demo sequence; it does not claim a live agent workload
has already been configured. The blog's wider discussion of AWS investment,
AgentCore Policy, gVisor, and policy-authoring work is retained in presenter notes.

## Visual style

The palette follows Fernando's requested black, `#00cc60`, white, and `#a78bfa`.
The bundled fonts match browser-computed styles on the website: JetBrains Mono
for headings and code, and Space Grotesk for body text. Font licenses are in
`public/fonts/`. Diagrams are original simplifications for this talk.

---
theme: default
layout: default
title: Strands Box — the big picture
info: |
  A five-slide introduction to Strands Box, adapted from Marc Brooker's
  “Strands Box: The Big Picture.” Speaker notes include context and sources.
author: Fernando Dingler
colorSchema: dark
canvasWidth: 1280
aspectRatio: 16/9
fonts:
  sans: Space Grotesk
  mono: JetBrains Mono
  provider: none
drawings:
  enabled: false
transition: fade
class: motivation
---

<div class="eyebrow">Strands Box / The big picture</div>

# Agents need room<br>to solve problems

<div class="lead">We use agents when the path to the goal<br>isn’t known in advance.</div>

<div class="tension">
  <div><h2>Too constrained</h2><p>The agent loses the freedom<br>to explore and adapt.</p></div>
  <div><h2>Too much access</h2><p>The agent can take actions<br>you never intended.</p></div>
</div>

<div class="thesis">Let the agent choose its approach.<br><strong>Enforce the boundaries deterministically.</strong></div>

<div class="scope">Strands Box pairs a local agent sandbox with semantic policy.</div>

<!--
Introduce Box through the problem, rather than through a feature list.
The blog starts from why we use agents: ambiguous goals and a path that cannot be fully prescribed.
When the process is already clear, a workflow can be the simpler choice. The hard case is preserving useful autonomy while constraining effects.
Box is a local sandbox with operating-system containment and Dogwood policy. It is not tied to the Strands Harness SDK, one model, or one cloud.
“Any harness” describes the integration model, not a promise that every harness runs without configuration.
Primary source: “Strands Box: The Big Picture,” opening discussion of agent autonomy and the tension of containment.
https://strandsagents.com/blog/strands-box-the-big-picture/
-->

---
class: rules
---

<div class="eyebrow">01 / Express the boundary</div>

# Policies should describe the work

<div class="lead">Define the conditions for an action in terms<br>the developer cares about.</div>

<div class="policy-examples">
  <div class="policy-example">
    <div class="rule-number">01</div>
    <div><h2>Gate a code push</h2><p>Require a passing <code>npm test</code> in the project<br>within 15 minutes, with no later <code>git add</code>.</p></div>
    <div class="rule-value"><strong>15</strong><span>minute window</span></div>
  </div>
  <div class="policy-example">
    <div class="rule-number">02</div>
    <div><h2>Bound tool usage</h2><p>Enforce a 60-attempt hourly budget<br>for AWS MCP tool calls.</p></div>
    <div class="rule-value"><strong>60</strong><span>attempts / hour</span></div>
  </div>
</div>

<div class="takeaway"><strong>Dogwood</strong> evaluates the action, its arguments, and recorded history.</div>

<!--
These are conceptual summaries of the blog's two Dogwood policy examples, not complete policies to paste into production.
The git rule requires a successful npm test in ~/my-project within the last 15 minutes, and no git add response since that test. Other actions, such as git switch, can still break the intended guarantee; the blog explicitly calls the example incomplete.
The MCP (Model Context Protocol) rule counts tools/call request events for the configured aws server, so the quota counts attempts rather than only successful calls.
The blog also uses a $100 daily payments budget to motivate semantic policy. Mention that verbally as another business-level condition, rather than adding a third on-screen example.
The investment is in deterministic policy expressed at the tool/operation level. It is not an LLM judging whether an action “seems safe.”
The blog notes that policy authoring needs further investment. Expressiveness does not make every policy easy to write or complete by default.
Primary source: blog's semantic-policy introduction and the two policy.dw examples.
-->

---
class: abstraction
---

<div class="eyebrow">02 / Choose where to enforce</div>

# Rich policy needs the right view

<div class="lead">Each layer exposes a different level of meaning.</div>

<div class="layer-table" role="table" aria-label="Isolation and policy layers">
  <div class="layer-header" role="row"><span role="columnheader">Layer</span><span role="columnheader">What it sees</span><span role="columnheader">A natural control</span></div>
  <div class="layer-row" role="row"><h2 role="cell">MicroVM boundary</h2><p role="cell">Device I/O and packets;<br>network payloads may be encrypted.</p><p role="cell">Send traffic through<br>a designated gateway.</p></div>
  <div class="layer-row" role="row"><h2 role="cell">System calls</h2><p role="cell">Files, processes,<br>and connections.</p><p role="cell">Read a project path;<br>deny writes.</p></div>
  <div class="layer-row semantic-row" role="row"><h2 role="cell">Semantic policy</h2><p role="cell">Commands, tool arguments,<br>and earlier results.</p><p role="cell">Allow a push only when<br>the test condition holds.</p></div>
</div>

<div class="takeaway">Box checks operations where it can understand their structure and history.</div>

<!--
This is the blog's comparison of abstraction levels, not a ranking of overall security.
A microVM's deliberately small device interface provides a strong isolation boundary. Block reads and encrypted network traffic are awkward inputs for rich per-tool policy.
System-call filtering has more meaning: paths, programs, and connections. The blog discusses compatibility costs and why syscall emulation, as in gVisor, still does not directly expose MCP tool semantics.
Rich policy belongs in components that understand the protocol or language. An outer microVM can require traffic to pass through such a gateway; the layers compose.
Box does not decrypt arbitrary ciphertext at the hardware boundary. Its gateway and interpreters expose structured requests at the policy layer.
Primary source: blog section “There are many ways to build a sandbox.”
-->

---
class: architecture
---

<div class="eyebrow">03 / How Box follows from policy</div>

# Contain with the OS. Decide in Box.

<div class="lead">The OS constrains access. Trusted components<br>apply policy to the operations they handle.</div>

<div class="architecture-flow">
  <div class="agent-zone"><span class="diagram-label">OS SANDBOX</span><strong>Agent</strong><p>Chooses tools.<br>Generates code.</p></div>
  <div class="flow-arrow" aria-hidden="true">→</div>
  <div class="trusted-zone">
    <span class="diagram-label">BOX · OUTSIDE THE AGENT PROCESS</span>
    <div class="entry-points"><span>Shell</span><span>Python</span><span>MCP</span><span>Network</span></div>
    <div class="policy-engine"><strong>Dogwood</strong><span>Structured operations + shared history</span><span class="decision">permit / deny</span></div>
  </div>
</div>

<div class="design-points"><span><strong>No guest OS required.</strong> Native containment on Linux and macOS.</span><span><strong>Policy covers generated code.</strong> Box checks shell and Python operations.</span></div>

<div class="scope-note">Direct filesystem grants remain OS-controlled and bypass individual Dogwood checks.</div>

<!--
The blog describes kernel isolation funneling interactions into a dedicated policy layer in user space. The agent does not control that layer.
Strands Shell and Monty expose operations performed by generated shell and Python code, alongside the MCP broker and egress gateway. This is central to the article's concluding point: local semantic policy includes agents that generate code to call tools.
The diagram groups components by responsibility; it is not a complete process or network diagram. The policy engine evaluates decisions, and the trusted components enforce them.
In the actual configuration, direct filesystem grants are an explicit exception: the OS enforces them without a Dogwood decision for each file operation. Keep policy-sensitive paths out of those grants. This scope qualification comes from the Box security docs.
Linux uses namespaces and seccomp; macOS uses Seatbelt. No microVM is required to use Box locally.
Primary source: blog's architecture discussion before the policy examples and the conclusion of “There are many ways to build a sandbox.”
Scope reference: Box docs/user/security.md, “The two tiers.”
-->

---
class: tradeoffs
---

<div class="eyebrow">04 / Compose the protections</div>

# Semantic control + strong isolation

<div class="tradeoff-grid">
  <div class="tradeoff-copy">
    <h2>Richer policy adds trusted code</h2>
    <p>Interpreters and protocol handlers<br>create more places for bugs.</p>
    <p class="investment">Built in Rust, with testing,<br>fuzzing, and validation.</p>
    <h2 class="cloud-heading">For multi-tenant cloud deployments</h2>
    <p>Pair Box with a dedicated microVM<br>for each agent session.</p>
  </div>
  <div class="microvm-zone">
    <span class="diagram-label">MICROVM · ONE PER SESSION</span>
    <div class="nested-box"><strong>Strands Box</strong><span>Local semantic policy</span><div class="nested-agent">Agent + tools</div></div>
    <p>For example, run Box inside<br>AgentCore Runtime.</p>
  </div>
</div>

<div class="demo-handoff"><span class="demo-label">NEXT / LIVE DEMO</span><strong>Run an agent. See Box enforce a rule.</strong></div>

<!--
End with the blog's explicit tradeoff. The trusted computing base includes interpreters and protocol handlers; Rust and validation reduce risk but do not eliminate bugs or policy bypasses.
The blog recommends adding a dedicated per-session microVM for multi-tenant cloud deployments, with AgentCore Runtime as the easiest example. Box supplies local semantic control, and the outer boundary isolates sessions.
AgentCore Policy can add tool-call governance in the cloud. The larger story is AWS investment in virtualization, automated reasoning, and open-source agent safety, not Box replacing those layers.
The demo handoff is a proposed sequence, not a claim that a particular live agent has already been configured. Choose the actual rule and workload before the talk.
Primary source: blog sections “There is no free lunch” and “The bigger picture.”
-->

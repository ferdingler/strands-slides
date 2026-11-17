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
class: title-slide
---

# Strands Box

<h2 class="title-subheading">An open source sandboxing engine for AI agents</h2>

<svg class="title-box" viewBox="0 0 280 290" fill="none" aria-hidden="true">
  <path d="M140 20 250 84 250 210 140 274 30 210 30 84Z" stroke="#00cc60" stroke-width="2"/>
  <path d="m30 84 110 64 110-64M140 148v126" stroke="#00cc60" stroke-width="2"/>
  <path d="m85 116 55-32 55 32M85 179l55 32 55-32" stroke="#a78bfa" stroke-width="2"/>
  <path d="M140 84v64" stroke="#a78bfa" stroke-width="2"/>
</svg>

<!--
Open with the product definition on screen, then explain the problem verbally.
We use agents for ambiguous goals where the path is not known in advance. If a fixed process already solves the problem, a workflow can be simpler.
The tension is preserving that freedom while setting precise boundaries: too little access prevents useful work; too much permits unintended actions.
Box combines native operating-system containment with deterministic semantic policy in Dogwood. It works with different models and harnesses, locally or in the cloud; integration may still require configuration.
This talk follows Marc Brooker's “Strands Box: The Big Picture,” rather than presenting an exhaustive feature list.
https://strandsagents.com/blog/strands-box-the-big-picture/
-->

---
class: history-slide
---

# Policy can depend on history

<div class="policy-timeline" role="img" aria-label="Example rule: a passing npm test within 15 minutes, with no later git add, permits git push.">
  <div class="timeline-node"><code>npm test</code><span>Passed</span></div>
  <div class="connector" aria-hidden="true"></div>
  <div class="timeline-node policy-node"><strong>Dogwood</strong><span>15-minute window</span></div>
  <div class="connector" aria-hidden="true"></div>
  <div class="timeline-node"><code>git push</code><span>Allowed</span></div>
</div>

<div class="history-condition">No <code>git add</code> since the test.</div>
<div class="example-label">Example rule</div>

<!--
This is semantic policy: the decision can use the action, its arguments, and prior outcomes. It is evaluated deterministically, outside the agent.
Walk left to right: a successful npm test in the configured project, followed by a git push within 15 minutes, with no git add after the test.
The diagram summarizes the blog's illustrative forbid rule. A complete policy also needs appropriate permits. The rule is not proof that every pushed change was tested: the article explicitly names git switch as one way the intended guarantee could fail.
The blog's second example enforces an hourly budget of 60 AWS MCP tool-call attempts. MCP means Model Context Protocol. Its rule counts request events, including refused attempts, rather than only successful calls. Mention this as a second application of history if useful.
The article also motivates a $100 daily payments limit. These examples show the value of business- and tool-level rules without claiming policy authoring is already effortless.
Primary source: the blog's semantic-policy motivation and two policy.dw examples.
-->

---
class: layers-slide
---

# Choose the right level of meaning

<div class="semantic-layers" role="img" aria-label="Increasing semantic context: microVMs see packets and blocks; system calls expose files and processes; semantic policy sees tools, arguments, and history.">
  <div class="semantic-layer device-layer"><h2>MicroVM</h2><span>Packets · Blocks</span></div>
  <div class="semantic-layer syscall-layer"><h2>System calls</h2><span>Files · Processes</span></div>
  <div class="semantic-layer operation-layer"><h2>Semantic policy</h2><span>Tools · Arguments · History</span></div>
</div>

<div class="layer-caption">More context for each decision</div>

<!--
The visual shows increasing semantic context, not a ranking of security strength.
A microVM deliberately exposes a small device interface. Network packets may contain encrypted payloads, and disk operations describe bytes and offsets. That is a strong boundary but an awkward location for per-tool policy.
System calls expose more meaning: paths, processes, and connections. They are a useful layer for controls such as read-only access to a directory.
The blog discusses syscall filtering's compatibility costs, and syscall emulation in gVisor. Neither directly exposes the full meaning of an MCP call in the way a protocol-aware broker does.
Box places semantic checks in language- and protocol-aware components, where the operation and its arguments are available. Dogwood adds recorded history.
The layers compose: an outer microVM can force network traffic through a gateway that applies richer policy.
Primary source: “There are many ways to build a sandbox.”
-->

---
class: architecture-slide
---

# Native isolation. External policy.

<div class="request-flow" role="img" aria-label="Mediated requests go from the agent's OS sandbox to trusted Box policy enforcement, then to tools and services.">
  <div class="agent-boundary"><span class="boundary-label">OS sandbox</span><strong>Agent</strong></div>
  <div class="request-connector"><span>Mediated requests</span><i aria-hidden="true"></i></div>
  <div class="box-boundary"><span class="boundary-label">Trusted Box process</span><strong>Dogwood</strong><span class="entry-points">Shell · Python · MCP · HTTP</span></div>
  <div class="connector" aria-hidden="true"></div>
  <div class="destination">Tools<br>and services</div>
</div>

<div class="architecture-caption">Linux + macOS. No microVM required.</div>

<!--
Explain the split: native OS mechanisms constrain the agent, and trusted components outside the agent process enforce Dogwood decisions for the requests they handle.
The diagram shows a logical request flow. The interpreters, gateway, and MCP broker consult Dogwood; Dogwood itself is not a proxy that forwards requests or executes tools.
Strands Shell and Monty provide policy checks for operations performed by generated shell and Python code. Network and MCP requests use the gateway and broker.
Linux uses namespaces and seccomp, and macOS uses Seatbelt. A guest operating system is not required to run Box locally.
The word “mediated” matters: direct filesystem grants remain OS-enforced and bypass per-operation Dogwood checks. External programs' own file operations are also outside those individual decisions. Keep policy-sensitive paths out of direct grants.
The blog's “only way out” description refers to funneling controlled interactions through the policy layer; this diagram does not claim every syscall is checked by Dogwood.
Primary source: blog architecture discussion and its two-pronged isolation/policy design.
Scope reference: Box docs/user/security.md, “The two tiers.”
-->

---
class: isolation-slide
---

# Pair policy with tenant isolation

<div class="isolation-context">For multi-tenant cloud deployments</div>

<div class="session-pair" role="img" aria-label="Two agent sessions, each inside its own microVM and each using Box for semantic policy.">
  <div class="session-boundary"><span class="boundary-label">Session A · MicroVM</span><div class="session-box"><strong>Box</strong><span>Agent</span></div></div>
  <div class="session-boundary"><span class="boundary-label">Session B · MicroVM</span><div class="session-box"><strong>Box</strong><span>Agent</span></div></div>
</div>

<div class="isolation-caption">Example: AgentCore Runtime</div>

<!--
The blog's recommendation for multi-tenant cloud deployments is a dedicated microVM per agent session, with Box inside it.
Box provides local semantic control. The outer boundary isolates sessions. AgentCore Runtime is the article's example of combining them; AgentCore Policy can add tool-call governance in the cloud.
This is a tradeoff, not a claim that Box's native containment is microVM-equivalent. Box trusts interpreters and protocol handlers in addition to OS mechanisms. More trusted code creates more opportunities for bugs and policy bypasses.
The implementation uses Rust with testing, fuzzing, and validation. Those investments reduce risk; they do not remove the need to choose an isolation boundary appropriate to the deployment.
The broader story is AWS investment in virtualization, automated reasoning, and open-source agent safety. Semantic policy complements those layers.
Transition verbally to the live demo: run an agent, trigger a policy condition, and inspect the decision. The deck does not configure that workload.
Primary source: “There is no free lunch” and “The bigger picture.”
-->

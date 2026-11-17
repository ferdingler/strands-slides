---
theme: default
layout: default
title: Strands Box — isolation with semantic policy
info: |
  A five-slide introduction to Strands Box.
  Source references and talking points are in each slide's presenter notes.
author: Fernando Dingler
colorSchema: dark
canvasWidth: 1280
aspectRatio: 16/9
fonts:
  sans: Figtree
  provider: none
drawings:
  enabled: false
transition: fade
class: opening
---

<div class="eyebrow">An open source sandbox engine for AI agents</div>

# Strands Box

<div class="hero-subtitle">Give agents room to work.<br>Define the conditions to act.</div>

<div class="hero-bottom">
  <div class="hero-point"><span>01</span><strong>Native OS isolation</strong><p>No microVM required.</p></div>
  <div class="hero-point"><span>02</span><strong>Semantic policy</strong><p>Operations, arguments, and history.</p></div>
  <div class="hero-point"><span>03</span><strong>Outside the agent</strong><p>Box enforces the decisions.</p></div>
</div>

<svg class="box-mark" viewBox="0 0 240 250" fill="none" aria-hidden="true">
  <path d="M120 18 222 77 222 190 120 249 18 190 18 77Z" stroke="currentColor" stroke-width="2"/>
  <path d="m18 77 102 59 102-59M120 136v113" stroke="currentColor" stroke-width="2"/>
  <path d="m69 106 51-29 51 29M69 163l51 29 51-29" stroke="#a78bfa" stroke-width="2"/>
  <path d="M120 77v59" stroke="#a78bfa" stroke-width="2"/>
</svg>

<!--
Open with the two questions Box answers: what can an agent reach, and under what conditions may it act?
Box combines native OS sandboxing with an embedded Dogwood policy engine.
Enforcement runs outside the agent process; it does not depend on the model following instructions.
Semantic means structured operations and arguments, plus recorded history. It does not mean an LLM guesses intent.
Sources: Box README.md, Overview and Architecture; docs/design/architecture.md, “Box decides outside the harness”.
-->

---
class: native
---

<div class="eyebrow">01 / Isolation</div>

# A sandbox without a microVM

<div class="subtitle">Use the host environment. Enforce access through the operating system.</div>

<div class="native-layout">
  <div class="boundary-diagram">
    <div class="diagram-label">HOST OPERATING SYSTEM</div>
    <div class="agent-boundary">
      <span class="small-label">OS SANDBOX</span>
      <strong>Your agent</strong>
      <span>Files · programs · network</span>
    </div>
    <div class="boundary-line"><span>Controlled access</span></div>
    <div class="host-resources">Existing tools and project paths</div>
  </div>
  <div class="native-copy">
    <h2>No guest OS to boot</h2>
    <p>Box uses the operator’s existing environment and paths.</p>
    <div class="platform"><strong>Linux</strong><span>Namespaces + seccomp</span></div>
    <div class="platform"><strong>macOS</strong><span>Seatbelt process sandbox</span></div>
  </div>
</div>

<div class="takeaway">The boundary is the host OS sandbox. A kernel escape can defeat it.</div>

<!--
The differentiator is deployment shape: Box does not boot a guest operating system.
Linux uses namespaces, a restricted mount view, and seccomp. macOS uses Seatbelt.
Do not claim microVM-equivalent isolation or benchmark gains. The architecture docs explicitly say a microVM provides stronger isolation.
The host kernel is part of the trust boundary. This is the tradeoff for working in the existing environment.
Sources: docs/design/architecture.md, “The boundary is the operating system’s own sandboxing”; docs/design/platform-differences.md; crates/containment/README.md.
-->

---
class: semantic
---

<div class="eyebrow">02 / Semantic policy</div>

# Make history part of permission

<div class="subtitle">Dogwood evaluates the operation, its arguments, and what happened before.</div>

<div class="policy-dimensions">
  <div><span class="dimension-number">01</span><h2>Operation</h2><p>Read a file. Send an HTTP request.<br>Call a specific tool.</p></div>
  <div><span class="dimension-number">02</span><h2>Arguments</h2><p>Which path, method, destination,<br>or tool parameters?</p></div>
  <div><span class="dimension-number">03</span><h2>History + time</h2><p>Which earlier actions occurred?<br>Within what time window?</p></div>
</div>

<div class="scenario">
  <div class="small-label">EXAMPLE RULE · BLOCK OUTBOUND REQUESTS FOR 10 MINUTES AFTER A SENSITIVE READ</div>
  <div class="event-flow">
    <div><span class="event-time">t = 0</span><strong>Read a sensitive file</strong><span>Through Shell or Python</span></div>
    <span class="flow-arrow">→</span>
    <div><span class="event-time">t + 1 minute</span><strong>Attempt an HTTP request</strong><span>Through the egress gateway</span></div>
    <span class="flow-arrow">→</span>
    <div class="verdict"><strong>DENY</strong><span>Earlier read changes<br>the decision.</span></div>
  </div>
</div>

<div class="policy-rule">For policy-checked operations: <code>permit</code> grants access, <code>forbid</code> overrides it, and no permit means deny.</div>

<!--
The temporal example is an illustrative rule an operator can write, not a built-in default.
It depends on a read mediated by Strands Shell or Monty and a request mediated by the gateway.
Use a completed fs:read response event, rather than a request event that could represent a denied attempt.
Box's README explicitly describes a file read affecting later outbound HTTP access.
This is event-based authorization, not content inspection or automatic tracking of where every byte flows.
Direct filesystem grants do not emit individual Dogwood decisions or events; keep sensitive files out of those grants.
The permit/forbid/default-deny statement applies to policy-mediated operations.
Sources: README.md, Overview and Key capabilities; docs/user/policy.md, “When the box asks policy”; docs/user/security.md, “The two tiers” and “Policy limitations”.
-->

---
class: enforcement
---

<div class="eyebrow">03 / Enforcement</div>

# One policy across code and tools

<div class="subtitle">Box’s interpreters and gateways enforce policy outside the agent process.</div>

<div class="enforcement-grid">
  <div class="policy-architecture">
    <div class="surface-row"><span>Strands Shell</span><span>Python / Monty</span></div>
    <div class="surface-row"><span>HTTP gateway</span><span>MCP broker</span></div>
    <div class="merge-line"><i></i><span>Policy checks + events</span><i></i></div>
    <div class="engine"><strong>Dogwood Local Engine</strong><span>Shared policy · shared event history</span></div>
  </div>
  <div class="enforcement-copy">
    <h2>Keep credentials outside the agent</h2>
    <p>The gateway adds configured credentials only after policy permits the request.</p>
    <h2>Explain each policy decision</h2>
    <p>Decision records identify what was allowed or denied. Named rules explain refusals.</p>
  </div>
</div>

<div class="takeaway">Direct filesystem grants are OS-enforced; they do not receive per-operation policy checks.</div>

<!--
MCP means Model Context Protocol. Its broker checks configured requests and tool calls.
The diagram shows the four policy integration points, not every process or trust boundary.
The engine and enforcement components run outside the agent sandbox.
Configured credentials include API credentials and AWS SigV4 signing. Avoid saying no secret can ever reach an agent: the claim is about gateway-managed credentials.
The logs describe policy decisions, not a complete trace of every system call. Direct file grants and external programs' individual file operations are not checked by Dogwood.
Sources: README.md, Key capabilities and Architecture; docs/user/security.md, “The two tiers”; docs/user/policy.md, “How a denial reads”.
-->

---
class: closing
---

<div class="eyebrow">04 / Put it to work</div>

# Bring your agent. Define its authority.

<div class="subtitle">Box is harness-agnostic, with examples for Strands, Claude Code, and Codex.</div>

<div class="setup-flow">
  <div><span class="step-number">1</span><h2>Configure the boundary</h2><code>box.toml</code><p>Choose the agent and its<br>direct access grants.</p></div>
  <div><span class="step-number">2</span><h2>Define the conditions</h2><code>policy.dw</code><p>Set rules for operations,<br>arguments, and history.</p></div>
  <div><span class="step-number">3</span><h2>Run and inspect</h2><code>allow / deny</code><p>Review refusals.<br>Grant only what is needed.</p></div>
</div>

<div class="launch-command"><span>$</span><code>./box-core/box run --config my-box/box.toml</code></div>

<div class="closing-bottom">
  <div><strong>Start with the quickstart</strong><a href="https://strandsagents.com/docs/user-guide/box/quickstart/" target="_blank" rel="noopener noreferrer">strandsagents.com/docs/user-guide/box/quickstart ↗</a></div>
  <div class="preview-note">Preview · macOS Apple silicon + Linux ARM64<br>Harness setup and proxy configuration may be required.</div>
</div>

<!--
The recommended next step is the website's Strands CLI quickstart: download Box, configure the agent, write policy, run, and inspect decisions.
The command assumes the quickstart's download and configuration steps are complete.
Harness-agnostic does not mean every agent runs unchanged. The Strands CLI quickstart includes proxy and tool configuration.
Current supported local platforms are macOS Apple silicon and Linux ARM64. Linux x86-64 is experimental and requires explicit opt-in.
Box also has a Rust library entry point; leave that for questions rather than crowding this slide.
Sources: https://strandsagents.com/docs/user-guide/box/quickstart/ ; README.md; examples/claude-code/README.md; examples/codex-cli/README.md.
-->

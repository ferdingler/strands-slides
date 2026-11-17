---
theme: default
layout: default
title: Strands Box — introduction
info: |
  A short introduction to Strands Box, following the AWS Open Source Blog post
  “Introducing Strands Box: AI agent sandboxes powered by Dogwood.”
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
Developer preview, Apache 2.0. Builds on Dogwood (policy language) and the Dogwood Local Engine.
https://aws.amazon.com/blogs/opensource/introducing-strands-box-ai-agent-sandboxes-powered-by-dogwood/
-->

---
class: yolo-slide
---

# Agents act without review

<div class="yolo" role="img" aria-label="One agent fans out to files, shell, APIs, and credentials, all auto-approved.">
  <div class="yolo-agent">Agent</div>
  <div class="yolo-fan" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
  <ul class="yolo-actions">
    <li><code>read files</code><span>auto-approved</span></li>
    <li><code>run shell</code><span>auto-approved</span></li>
    <li><code>call APIs</code><span>auto-approved</span></li>
    <li><code>use credentials</code><span>auto-approved</span></li>
  </ul>
</div>

<!--
Agents are useful because they act: they read files, run shell commands, execute generated code, and call APIs.
That same autonomy is the risk. Coding assistants, home-grown harnesses, and off-the-shelf agents increasingly run in "YOLO mode", approving every action with no human in the loop.
So agents wander out of their working directory, run a dangerous command, or reach a credential they were never meant to see.
-->

---
class: layers-slide
---

# Contain, then govern

<div class="layers" role="img" aria-label="The agent runs inside OS containment. Its actions pass through four Box enforcement points that consult the Dogwood Local Engine.">
  <div class="contain">
    <span class="boundary-label">OS containment</span>
    <strong>Agent</strong>
  </div>
  <div class="layers-arrow" aria-hidden="true"></div>
  <div class="govern">
    <span class="boundary-label">Box policy</span>
    <div class="points"><span>Egress</span><span>Shell</span><span>Python</span><span>MCP</span></div>
    <strong>Dogwood Local Engine</strong>
  </div>
</div>

<div class="layers-caption">One event history across every tool</div>

<!--
Sandboxes limit reach, but not behavior: an incident agent should read logs without changing infrastructure, and containers or microVMs can't express that. So, two layers. Containment uses OS isolation (macOS Seatbelt today) to set the hard boundary: what the agent can reach on the host and the network.
Inside that boundary, policy decides which actions are allowed. Four enforcement points: a network egress gateway every outbound request goes through, a Shell interpreter (Strands Shell), a Python interpreter (Monty), and an MCP broker. The interpreters and broker run in Box's process, outside the sandbox; the agent reaches them as ordinary bash, python3, and MCP over a local socket.
All four use the embedded Dogwood Local Engine and share one history. Actions are normalized: a file read from shell or Python is fs:read; curl or Python HTTP is http:request. So you can write "after reading customer data, block outbound HTTP" without caring which tool did the read.
Caveat: folders granted directly to the agent (like the project it edits) are bounded by containment only and don't appear in policy history.
Why not microVMs? They isolate well, but add a separate guest environment to provision. Box runs in the developer's existing environment, and isolation alone still doesn't solve policy.
-->

---
class: effect-slide
---

# Judge the effect, not the call

<div class="effect" role="img" aria-label="A harness sees one shell command. Box sees one fs:delete decision per file, which a forbid rule blocks.">
  <div class="effect-col">
    <span class="boundary-label">Harness sees</span>
    <code class="effect-cmd">rm -rf build/</code>
  </div>
  <div class="effect-arrow" aria-hidden="true"></div>
  <div class="effect-col box-sees">
    <span class="boundary-label">Box sees</span>
    <code>fs:delete build/app.o</code>
    <code>fs:delete build/lib.o</code>
    <code>fs:delete build/main</code>
    <span class="effect-verdict">forbid — nothing deleted</span>
  </div>
</div>

<!--
Agents increasingly write code to do work, often Python and shell. That keeps intermediate data out of the model and saves tokens, but that code reads files and makes network calls, so interpreters are a great place to enforce policy.
When the agent runs rm -rf build/, Strands Shell resolves the command and raises an fs:delete decision for each file. A forbid rule on fs:delete stops it before anything is deleted, while normal edits in the workspace still go through.
This is also why harness permission prompts aren't enough: they run inside the agent's process and judge the tool call, not its effect. They also use different rule formats per harness. Box enforces from outside, and the same profile and policy.dw work across Claude Code, Codex, Kiro CLI, and pi.
Trade-off: running interpreters outside the sandbox widens the trusted computing base.
-->

---
class: secret-slide
---

# Secrets never enter the box

<div class="secret-flow" role="img" aria-label="The agent sends a placeholder token. The egress gateway checks policy, swaps in the real secret, and forwards to the service.">
  <div class="secret-node"><span class="boundary-label">Agent</span><code>PLACEHOLDER</code></div>
  <div class="secret-arrow" aria-hidden="true"></div>
  <div class="secret-node gateway"><span class="boundary-label">Egress gateway</span><strong>policy ✓</strong><code>real secret</code></div>
  <div class="secret-arrow" aria-hidden="true"></div>
  <div class="secret-node"><span class="boundary-label">Service</span><code>slack.com</code></div>
</div>

<div class="secret-caption">Bearer · Header · Basic · Query · SigV4</div>

<!--
Every outbound request goes through the egress gateway. It sees host, port, method, and path, raises an http:request decision, and forwards only what policy permits.
Because it sits in that path, it can do something the agent can't do safely: attach credentials. The agent gets a placeholder; the gateway swaps in the real secret on the way out. The real secret never enters the agent's environment.
Supported today: bearer token, custom header (e.g. x-api-key), HTTP Basic, query parameter, and AWS SigV4, where the gateway signs with host-side credentials, for example from an "oncall" AWS profile backed by a read-only IAM role.
Note: a credential binding grants no network reach by itself. Each destination still needs a permit.
-->

---
class: memory-slide
---

# Temporal policies

<div class="memory-rule">Allow my agent to post to Slack,<br>but no more than 3 messages every 10 min</div>

<div class="memory-timeline" role="img" aria-label="Posts at 10:00, 10:03, and 10:05 are allowed; a fourth post at 10:06 is denied; reading logs at 10:07 is allowed; a post at 10:11 is allowed.">
  <div class="tick"><time>10:00</time><span>post</span><b>allow</b></div>
  <div class="tick"><time>10:03</time><span>post</span><b>allow</b></div>
  <div class="tick"><time>10:05</time><span>post</span><b>allow</b></div>
  <div class="tick deny"><time>10:06</time><span>post</span><b>deny</b></div>
  <div class="tick"><time>10:07</time><span>logs</span><b>allow</b></div>
  <div class="tick"><time>10:11</time><span>post</span><b>allow</b></div>
</div>

<!--
This is where Dogwood shines: temporal operators let a decision depend on what the agent already did, its order, and limits accumulated over time.
Scenario: an on-call agent posts progress to the incident channel. We want updates, but not a flood that buries the humans. So: at most three posts every 10 minutes.
The rule counts recorded http:request responses to chat.postMessage with status 200, "formerly within 10m", and forbids once the count reaches 3. Binding on the response means refused attempts don't count.
At 10:06 the agent doesn't get a silent failure: a 403 names the rule by @id and carries its @description ("Wait before you post again"), so the agent waits instead of retrying. Investigation continues under the AWS permits meanwhile.
The same shape expresses any count, cooldown, or ordering constraint. Box enforces it; the agent doesn't have to remember.
-->

---
class: otel-slide
---

# Every decision, in OpenTelemetry

<div class="otel" role="img" aria-label="Box policy decisions and the agent's own OpenTelemetry spans flow into one OTLP record on a shared timeline.">
  <div class="otel-sources">
    <div class="otel-src box-src"><strong>Box</strong><span>every permit and deny</span></div>
    <div class="otel-src"><strong>Agent</strong><span>its own OTEL spans</span></div>
  </div>
  <div class="otel-join" aria-hidden="true"><i></i></div>
  <div class="otel-sink"><span class="boundary-label">OTLP</span><strong>One timeline</strong></div>
</div>

<div class="otel-record"><b>deny</b><code>http:request</code><code>slack.com</code><code>rate_limit_slack_posts</code></div>

<!--
Every policy decision Box makes is recorded, on by default, with no collector to install. Each record names the action, resource, verdict, and the rules that decided it, using standard OpenTelemetry keys like server address, method, file path, or resolved command.
Each decision is both a span and a log record: the log is audit evidence, the span puts the decision on a timeline next to the agent's work.
Box also accepts the agent's own OpenTelemetry. It points the standard OTEL_EXPORTER_OTLP_ENDPOINT at a loopback receiver, so an unmodified agent SDK exports with no code changes. Decisions carry the caller's trace context, so a denial lines up with the agent step that caused it.
The agent is untrusted, so Box strips any attempt to forge Box's own attributes, and ignores "not sampled" for its decisions: an agent can't hide its own refusals.
Output is OTLP JSON, one request per line, in a file the agent can't read or truncate. Records stay on your machine; point any OTEL viewer at it.
Secrets stay out: no full URLs or command lines, and shell arguments are redacted unless they're plain flags.
The record on the slide is an illustrative summary of a decision, not raw OTLP.
Source: Box Core docs/design/telemetry.md.
-->

---
class: deploy-slide
---

# Deploy anywhere

<div class="deploy" role="img" aria-label="Custom agents built with Strands, LangGraph, or the Claude Agent SDK are packaged with Box and its policy, then deployed to AgentCore Runtime, EKS, EC2, or on-premises.">
  <ul class="deploy-list">
    <li>Strands</li>
    <li>LangGraph</li>
    <li>Claude Agent SDK</li>
    <li>Your own</li>
  </ul>
  <div class="deploy-arrow" aria-hidden="true"></div>
  <div class="deploy-core"><span class="boundary-label">Box + policy.dw</span><strong>Your agent</strong></div>
  <div class="deploy-arrow" aria-hidden="true"></div>
  <ul class="deploy-list targets">
    <li>AgentCore Runtime</li>
    <li>EKS</li>
    <li>EC2</li>
    <li>On-premises</li>
  </ul>
</div>

<div class="deploy-caption">The policy travels with the agent.</div>

<!--
This one is for agent builders. If you're building your own agent with Strands, LangGraph, the Claude Agent SDK, or anything else, you can package it with Box.
The box and its Dogwood policy ship as part of the deployment, so the rules governing the agent's actions stay with it wherever it runs: AgentCore Runtime, EKS, EC2, or your own data center.
Same containment, same policy, same OpenTelemetry decision records, from a laptop to production.
For multi-tenant cloud deployments, pair Box with a per-session isolation boundary such as an AgentCore Runtime microVM: Box gives semantic control inside, the microVM isolates sessions.
-->

---
class: start-slide
---

# Your agent, in a box

<div class="terminal">
  <div><span class="prompt">$</span> box profile create claude</div>
  <div><span class="prompt">$</span> box run claude</div>
</div>

<div class="agents"><span>Claude Code</span><span>Codex</span><span>Kiro CLI</span><span>pi</span></div>

<div class="start-link">github.com/strands-agents/box</div>

<!--
The box CLI is the front door. box profile create picks an agent starter, the model provider, your MCP servers, and a starting policy: Open (any host but localhost), Scoped (only the model, package registries, and hosts you add), or Locked (also no shell commands of its own). Press Enter for each default.
The profile lives in ~/.box/profiles/claude/: a short profile.toml listing packs (agent, provider, toolchains like git, cargo, node) and a policy.dw that's yours to edit. Box generates the Box Core configuration from it; box profile show claude --full prints it.
Then cd into a project and box run claude. The agent can change that project; your other files, keys, and localhost services are out of reach. Model keys are added at the gateway, never seen by the agent.
Starters today: Claude Code, Codex, Kiro CLI, pi. Apple Silicon Mac with macOS 15+; Linux ARM64 is experimental.
Don't want to write Dogwood by hand? The Policy Authoring agent skill teaches your agent to write Box policies.
What's next: more operating systems, packaging Box with deployed agents (AgentCore, ECS, Kubernetes), and Dogwood liveness rules.
Issues on GitHub, questions on Discord.
-->

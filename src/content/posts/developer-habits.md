---
title: "The Habits That Actually Made Me a Better Developer"
date: "2025-03-20"
tags: ["personal", "career", "process"]
description: "Not the habits productivity gurus tell you about. The ones that actually moved the needle — most of which I learned the hard way."
featured: false
draft: false
---

## The ones nobody talks about

There's no shortage of content about developer habits. Use a Pomodoro timer. Write tests first. Do code reviews. Review your code reviews. Review your reviews.

Most of it is fine advice. Little of it is the thing that actually changed how I work.

Here are the habits that did.

## Read the error message. The whole thing.

I don't mean skim it looking for the file name. I mean read it, from the first line to the last, before doing anything else.

I spent the first two years of my career barely reading error messages. I'd see "TypeError: Cannot read properties of undefined" and immediately start changing things — adding null checks, console logging intermediate values, commenting out code. Half the time the second line of the stack trace would have told me exactly what was wrong in thirty seconds.

Slow down. Read it.

## Keep a "what I did today" note

Not a journal. Not a system. A plain text file I update whenever I finish something, or hit a wall, or make a decision I might later question.

The entries look like:

```
2025-03-20
- Fixed the N+1 query in the user list endpoint — added eager loading for `roles`
- Opened PR for the auth refactor, blocked on question about session invalidation
- Decision: going with JWTs over sessions because we need to support mobile eventually
```

That's it. I've used this to reconstruct what I was thinking during a difficult debug, to write better commit messages, and — more times than I'd like to admit — to remember what I was doing when I got interrupted on a Friday afternoon.

## Debug assumptions, not symptoms

When something is broken, the instinct is to poke at the place where it broke. That's rarely where the problem is.

A technique that works: write out, in plain English, every assumption your code makes. Then check each one.

> "I'm assuming the API returns an array. I'm assuming it's already sorted. I'm assuming the date field is an ISO string."

One of those assumptions is wrong. Check them in order of how likely they are to be wrong, and you'll find the bug three times faster.

## Go for a walk before you've tried for more than an hour

This one sounds too simple to be real, but it is. After forty-five minutes of being stuck on something, your brain has committed to the wrong model of the problem. Walking away physically resets that.

I've solved more bugs in the shower than I care to admit. The shower doesn't make you smarter. It just gets you away from the screen long enough to stop defending your current theory.

## Understand the thing below the thing you're using

If you use a framework, understand what the framework is built on. If you use an ORM, understand what SQL it generates. If you deploy to the cloud, understand what you're paying for and why.

This isn't about becoming an expert in everything. It's about not being mystified when things go wrong. And they will go wrong. At 2am, on a Friday, in production.

The engineers who are good in a crisis are almost always the ones who went one layer deeper at some point.

---

None of these are exciting. There's no app, no framework, no tool. They're just practices that compound slowly — and in software, slow compounding is how you get good.

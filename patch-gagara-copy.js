const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/page.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// ─────────────────────────────────────────────
// 1. HERO TAG LINE
// OLD: "Both sides are protected. Always."
// WHY CHANGE: This is a conclusion, not an opening.
// A first-time visitor has not felt the problem yet,
// so telling them the solution means nothing.
// NEW: Lead with the universal fear — starting something
// and not knowing if the other person will follow through.
// ─────────────────────────────────────────────
c = c.replace(
  `Both sides are protected. Always.`,
  `You want to engage. But what if they don't follow through?`
);
console.log('hero tag: OK');

// ─────────────────────────────────────────────
// 2. HERO HEADLINE
// OLD: "The money is there. You can both see it."
// WHY CHANGE: Jumps straight to a feature before the
// visitor connects emotionally. Someone who has never
// been burned reads this and thinks "so what?"
// NEW: Name the two fears everyone shares before
// starting any agreement — wasting effort and losing money.
// Once they nod, they are ready to hear the solution.
// ─────────────────────────────────────────────
c = c.replace(
  `The money is there.<br /><em>You can both see it.</em>`,
  `No more starting and<br /><em>hoping for the best.</em>`
);
console.log('hero headline: OK');

// ─────────────────────────────────────────────
// 3. HERO DESCRIPTION
// OLD: Technical explanation of what the vault does.
// WHY CHANGE: "Locked in a shared vault" and
// "Nobody can touch it alone" sound like bank language.
// A normal person hears that and gets cautious.
// NEW: Use the language of everyday commitment.
// Both sides put something on the line before anyone starts.
// That is the real product — mutual commitment, not a vault.
// ─────────────────────────────────────────────
c = c.replace(
  `Before any work starts, the payment is locked in a shared vault.
            The person doing the work sees it sitting there. The person paying knows exactly where their money is.<br /><br />
            <strong>Nobody can touch it alone.</strong> It only moves when both of you agree the job is done.`,
  `Before anyone starts, both sides confirm their commitment through Gagara.
            The person paying shows the money is real and ready. The person working knows they will be paid the moment the job is done.<br /><br />
            <strong>No chasing. No excuses. No surprises.</strong> Everyone knows exactly what happens and when.`
);
console.log('hero description: OK');

// ─────────────────────────────────────────────
// 4. HERO STATS
// OLD: "2× Protected", "0 Surprises", "∞ Deal types"
// WHY CHANGE: "Deal types" sounds transactional and cold.
// "2×" looks like a marketing trick.
// NEW: Keep the numbers but make the labels human.
// Replace "Deal types" with "Kinds of agreement" —
// broader, warmer, and covers the full range from
// a small favour to a large contract.
// ─────────────────────────────────────────────
c = c.replace(
  `Protected<br />Payer and receiver both`,
  `Both sides covered<br />Not just one person`
);
c = c.replace(
  `Surprises<br />Every step is visible`,
  `Surprises<br />Everyone sees every step`
);
c = c.replace(
  `Deal types<br />Any agreement, any size`,
  `Kinds of agreement<br />Small favour to big contract`
);
console.log('hero stats: OK');

// ─────────────────────────────────────────────
// 5. HERO CTA BUTTON
// OLD: "Start a deal for free"
// WHY CHANGE: "Deal" can sound like a business transaction
// or even a shady arrangement for some people.
// NEW: "Create a free agreement" — agreement is a word
// everyone understands. It covers services, goods,
// projects, favours — everything Gagara handles.
// ─────────────────────────────────────────────
c = c.replace(
  `Start a deal for free`,
  `Create a free agreement`
);
console.log('hero CTA: OK');

// ─────────────────────────────────────────────
// 6. VAULT SECTION LABEL
// OLD: "The shared vault — live example"
// WHY CHANGE: "Vault" makes people think of banks and
// complexity. Someone not in finance hears vault and
// immediately imagines fees, accounts, approvals.
// NEW: "How your agreement looks — live example"
// This tells them exactly what they are looking at
// without introducing any financial jargon.
// ─────────────────────────────────────────────
c = c.replace(
  `The shared vault — live example`,
  `How your agreement looks — live example`
);
console.log('vault label: OK');

// ─────────────────────────────────────────────
// 7. VAULT NOTE (inside the vault graphic)
// OLD: "Held by Gagara / Neither side acts alone"
// WHY CHANGE: "Held by Gagara" still sounds like
// a financial custodian. People worry about who
// controls their money.
// NEW: "Managed by Gagara / Both sides must agree"
// Managed is softer and more neutral. "Both sides
// must agree" is the plain truth of how it works.
// ─────────────────────────────────────────────
c = c.replace(
  `Held by Gagara<br />Neither side acts alone`,
  `Managed by Gagara<br />Both sides must agree`
);
console.log('vault note: OK');

// ─────────────────────────────────────────────
// 8. HOW IT WORKS — SECTION HEADING
// OLD: "Simple steps. No surprises."
// WHY CHANGE: Fine but generic. Any product says this.
// NEW: "Here is exactly what happens."
// Direct, confident, and implies full transparency —
// which is the whole product promise.
// ─────────────────────────────────────────────
c = c.replace(
  `Simple steps. <em>No surprises.</em>`,
  `Here is exactly <em>what happens.</em>`
);
console.log('how it works heading: OK');

// ─────────────────────────────────────────────
// 9. HOW IT WORKS — SECTION DESCRIPTION
// OLD: "Every deal on Gagara follows the same order..."
// WHY CHANGE: "Deal" again, and "follows the same order"
// sounds like a legal document.
// NEW: Warmer, explains the core value in plain language.
// The key idea is that both people agreed to the same
// thing before anyone moved — that is the protection.
// ─────────────────────────────────────────────
c = c.replace(
  `Every deal on Gagara follows the same order. Both of you can see every step as it happens. Nothing is hidden, nothing is skipped.`,
  `Every agreement on Gagara works the same way. You both agreed to the same thing before anyone started. Both of you can see every step as it happens. Nothing is hidden.`
);
console.log('how it works description: OK');

// ─────────────────────────────────────────────
// 10. STEP 1 DESCRIPTION
// OLD: "One person sets up the deal — the amount,
// what is expected, and when. They share a short
// code with the other party."
// WHY CHANGE: "sets up the deal" is cold. "short code"
// sounds technical.
// NEW: Human language — "you decide together",
// "write it down once", "share it simply".
// ─────────────────────────────────────────────
c = c.replace(
  `One person sets up the deal — the amount, what is expected, and when. They share a short code with the other party.`,
  `One person writes up the agreement — the amount, what is expected, and by when. They share a simple code with the other person so both are looking at the same thing.`
);
console.log('step 1: OK');

// ─────────────────────────────────────────────
// 11. STEP 2 DESCRIPTION
// OLD: "The payer puts the money in. It is locked..."
// WHY CHANGE: "Locked" sounds punitive. "Payer" is
// a finance term that distances the reader.
// NEW: "The person paying" — plain and warm.
// "Reserved" instead of "locked" — same meaning,
// less intimidating.
// ─────────────────────────────────────────────
c = c.replace(
  `The payer puts the money in. It is locked. The person doing the work can see it sitting there before they start anything.`,
  `The person paying puts the money in through Gagara. It is reserved and cannot be taken back. The person doing the work can see it is there before they lift a finger.`
);
console.log('step 2: OK');

// ─────────────────────────────────────────────
// 12. STEP 4 DESCRIPTION
// OLD: "When the work is done, both parties confirm it.
// One person saying yes is not enough."
// WHY CHANGE: "Both parties" is legal language.
// NEW: "Both of you" — simple and personal.
// ─────────────────────────────────────────────
c = c.replace(
  `When the work is done, both parties confirm it. One person saying yes is not enough. Both must agree before anything moves.`,
  `When the work is done, both of you confirm it. One person saying yes is not enough. Both must agree before the money moves.`
);
console.log('step 4: OK');

// ─────────────────────────────────────────────
// 13. WHO IT HELPS — SECTION HEADING
// OLD: "Built for the moments trust is not enough."
// WHY CHANGE: "Trust is not enough" can sound cynical.
// Some people hear that and think Gagara assumes
// everyone is dishonest.
// NEW: The real message is about uncertainty, not distrust.
// You might trust the person but still feel unsure
// about what happens if things go wrong.
// ─────────────────────────────────────────────
c = c.replace(
  `Built for the moments <em>trust is not enough.`,
  `For anyone who has ever wondered <em>what if this goes wrong.`
);
console.log('who it helps heading: OK');

// ─────────────────────────────────────────────
// 14. WHO IT HELPS — SECTION DESCRIPTION
// OLD: "You do not need to have been burned to use Gagara.
// But if you have, you know exactly why this exists."
// WHY CHANGE: "Burned" is slang that not everyone uses.
// Also this only speaks to people with bad experiences —
// but Gagara is also for people who just want clarity
// before starting something new.
// NEW: Open it up. You do not need a bad experience.
// Anyone starting something uncertain can use this.
// ─────────────────────────────────────────────
c = c.replace(
  `You do not need to have been burned to use Gagara. But if you have, you know exactly why this exists.`,
  `You do not need a bad experience to want certainty before you start. Gagara is for anyone taking on work or paying for something where the stakes matter.`
);
console.log('who it helps description: OK');

// ─────────────────────────────────────────────
// 15. STORY 1 — SITUATION
// OLD: "You finished the work. They stopped replying."
// WHY CHANGE: Good but the second line is about the
// other person's behaviour. Lead with YOUR feeling first.
// NEW: Start with the feeling of being left hanging —
// that is what people remember and relate to.
// ─────────────────────────────────────────────
c = c.replace(
  `You finished the work.<br /><em>They stopped replying.</em>`,
  `You delivered everything.<br /><em>Then the silence started.</em>`
);
console.log('story 1 situation: OK');

// ─────────────────────────────────────────────
// 16. STORY 1 — OUTCOME
// OLD: "Get paid when the job is done. Not when they feel like it."
// WHY CHANGE: "Not when they feel like it" sounds bitter
// and assumes bad faith. We want to sound fair, not angry.
// NEW: Positive outcome framing.
// ─────────────────────────────────────────────
c = c.replace(
  `Get paid when the job is done. Not when they feel like it.`,
  `When you finish the work, the payment is already waiting for you.`
);
console.log('story 1 outcome: OK');

// ─────────────────────────────────────────────
// 17. STORY 2 — OUTCOME
// OLD: "Your money is safe until you say so."
// WHY CHANGE: Fine but passive. Make it active —
// YOU are in control, not Gagara.
// ─────────────────────────────────────────────
c = c.replace(
  `Your money is safe until you say so.`,
  `The money does not move until you confirm you got what you paid for.`
);
console.log('story 2 outcome: OK');

// ─────────────────────────────────────────────
// 18. STORY 3 — BODY
// OLD: "Gagara locks the commitment on both sides before
// work begins. If conditions are met, you get paid. No excuses."
// WHY CHANGE: "Locks the commitment" is still vault language.
// "No excuses" sounds aggressive.
// NEW: Softer and clearer — both sides put their word
// down before anyone starts.
// ─────────────────────────────────────────────
c = c.replace(
  `You spent time, materials, and energy on a big job. Then the client pulled out. Gagara locks the commitment on both sides before work begins. If conditions are met, you get paid. No excuses.`,
  `You spent time, materials, and energy preparing for a big job. Then the client changed their mind. With Gagara, both sides commit before anyone starts. If you do what was agreed, the payment is there. That is the whole point.`
);
console.log('story 3 body: OK');

// ─────────────────────────────────────────────
// 19. STORY 3 — OUTCOME
// OLD: "Both sides are committed before anyone starts."
// WHY CHANGE: Repeats what the body already said.
// NEW: End on the feeling of security, not the mechanic.
// ─────────────────────────────────────────────
c = c.replace(
  `Both sides are committed before anyone starts.`,
  `You start with confidence, not just hope.`
);
console.log('story 3 outcome: OK');

// ─────────────────────────────────────────────
// 20. MODES SECTION HEADING
// OLD: "Any size. Any kind of agreement."
// WHY CHANGE: Decent but the sub-description below
// explains it with "deal" again.
// NEW: More human framing — whether it is a favour
// or a formal project, Gagara fits.
// ─────────────────────────────────────────────
c = c.replace(
  `Any size. <em>Any kind of agreement.</em>`,
  `A small favour or a big project. <em>Gagara fits both.</em>`
);
console.log('modes heading: OK');

// ─────────────────────────────────────────────
// 21. MODES SECTION DESCRIPTION
// OLD: "You choose the deal type each time you create
// a new agreement. Your account stays the same."
// WHY CHANGE: "Deal type" is the old language again.
// NEW: Frame it around the size of the commitment,
// not the product tier. People understand size intuitively.
// ─────────────────────────────────────────────
c = c.replace(
  `You choose the deal type each time you create a new agreement. Your account stays the same.`,
  `Each time you create an agreement, you pick how much protection you need based on the size and importance of the work. Your account stays the same either way.`
);
console.log('modes description: OK');

// ─────────────────────────────────────────────
// 22. PERSONAL MODE DESCRIPTION
// OLD: "Small jobs, favors with money attached, or anything
// between individuals who want to do things properly."
// WHY CHANGE: "Favors with money attached" is awkward.
// NEW: Give concrete examples. People need to picture
// themselves in the situation.
// ─────────────────────────────────────────────
c = c.replace(
  `Small jobs, favors with money attached, or anything between individuals who want to do things properly.`,
  `Paying someone to fix something, sending money for a service, or any small agreement between two people. Simple and quick to set up.`
);
console.log('personal mode: OK');

// ─────────────────────────────────────────────
// 23. BUSINESS MODE DESCRIPTION
// OLD: "Service contracts, supplier payments, project work
// split into stages. Built for deals where the details matter."
// WHY CHANGE: Fine but still uses "deals".
// NEW: Same meaning, warmer words.
// ─────────────────────────────────────────────
c = c.replace(
  `Service contracts, supplier payments, project work split into stages. Built for deals where the details matter.`,
  `Service agreements, supplier payments, or project work paid in stages as it gets done. Built for situations where the details and the timeline both matter.`
);
console.log('business mode: OK');

// ─────────────────────────────────────────────
// 24. ENTERPRISE MODE DESCRIPTION
// OLD: "Large contracts with multiple conditions, multiple
// parties, and documentation requirements. Built for deals
// where the stakes are high."
// WHY CHANGE: "Deals where the stakes are high" is vague.
// NEW: Tell them exactly what kind of situation this is for.
// ─────────────────────────────────────────────
c = c.replace(
  `Large contracts with multiple conditions, multiple parties, and documentation requirements. Built for deals where the stakes are high.`,
  `Large agreements involving multiple people, big amounts, and formal conditions that everyone needs to sign off on. Built for when getting it wrong is not an option.`
);
console.log('enterprise mode: OK');

// ─────────────────────────────────────────────
// 25. PAYOUTS SECTION HEADING
// OLD: "Money moves the moment both agree."
// WHY CHANGE: Good but it still sounds mechanical.
// NEW: Lead with the result the receiver cares about —
// getting paid fast the moment the job is confirmed done.
// ─────────────────────────────────────────────
c = c.replace(
  `Money moves <em>the moment both agree.</em>`,
  `You get paid <em>the moment it is confirmed done.</em>`
);
console.log('payouts heading: OK');

// ─────────────────────────────────────────────
// 26. PAYOUTS SECTION DESCRIPTION
// OLD: "Once both parties confirm the work is done,
// payment goes out immediately..."
// WHY CHANGE: "Both parties" is legal language again.
// NEW: "Both of you" — same meaning, warmer.
// ─────────────────────────────────────────────
c = c.replace(
  `Once both parties confirm the work is done, payment goes out immediately. The receiver chooses how they want to be paid before the deal even starts.`,
  `Once both of you confirm the work is done, payment goes out straight away. The person receiving the money chooses how they want to be paid before the agreement even begins.`
);
console.log('payouts description: OK');

// ─────────────────────────────────────────────
// 27. CLOSING TAG
// OLD: "Fair for both sides. Always."
// WHY CHANGE: Generic and could apply to anything.
// NEW: Tie it back to the opening fear — certainty
// before you start, not just fairness after.
// ─────────────────────────────────────────────
c = c.replace(
  `Fair for both sides. Always.`,
  `Certainty before you start. Every time.`
);
console.log('closing tag: OK');

// ─────────────────────────────────────────────
// 28. CLOSING HEADLINE
// OLD: "You should not have to just trust and hope."
// WHY CHANGE: "Trust and hope" is a bit abstract.
// The real fear is more specific — starting something
// and not knowing what happens if it goes wrong.
// NEW: Name the commitment moment directly.
// ─────────────────────────────────────────────
c = c.replace(
  `You should not have to<br /><em>just trust and hope.</em>`,
  `Start every agreement knowing<br /><em>exactly how it ends.</em>`
);
console.log('closing headline: OK');

// ─────────────────────────────────────────────
// 29. CLOSING BODY
// OLD: "Gagara gives both the person paying and the person
// working the same thing: certainty..."
// WHY CHANGE: Still a bit abstract. Bring it back
// to the real human situation — before you start,
// you already know what happens when you finish.
// NEW: Speak to the moment of deciding whether to engage.
// That is the exact moment Gagara helps with.
// ─────────────────────────────────────────────
c = c.replace(
  `Gagara gives both the person paying and the person working the same thing: certainty. The money is there. The conditions are agreed. When the job is done, everyone gets what they were promised.`,
  `The moment you are not sure whether to say yes — whether to take the job, sign the contract, or trust someone with your money — that is exactly when Gagara helps. Both sides put their commitment down before anyone starts. When the work is done, everyone gets what was agreed.`
);
console.log('closing body: OK');

// ─────────────────────────────────────────────
// 30. CLOSING CTA BUTTON
// OLD: "Create your first deal"
// WHY CHANGE: "Deal" one last time.
// NEW: "Create your first agreement" — consistent
// with the language we use throughout the page now.
// ─────────────────────────────────────────────
c = c.replace(
  `Create your first deal`,
  `Create your first agreement`
);
console.log('closing CTA: OK');

// ─────────────────────────────────────────────
// 31. FOOTER TRUST TAGS
// OLD: Includes "Dispute documentation" and "Full record kept"
// which sound like legal jargon.
// NEW: Replace with human-language equivalents.
// ─────────────────────────────────────────────
c = c.replace(
  `'Both sides protected','Money visible to both','No one acts alone','Conditions agreed upfront','Full record kept','Dispute documentation','Works across borders','Any currency'`,
  `'Both sides protected','Everyone sees the same thing','No one acts alone','Conditions agreed before you start','Full history saved','Help if something goes wrong','Works across borders','Any currency'`
);
console.log('footer tags: OK');

// ─────────────────────────────────────────────
// 32. FOOTER LEGAL LINKS
// OLD: Only has product nav links — no Privacy, Terms, Safety
// WHY CHANGE: Trust layer is missing. Any serious product
// needs these in the footer for credibility.
// NEW: Add Privacy, Terms, and Safety to footer nav.
// ─────────────────────────────────────────────
c = c.replace(
  `<li><a href="#vault">The vault</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#situations">Who it helps</a></li>
          <li><a href="#modes">Deal types</a></li>`,
  `<li><a href="#vault">How it works</a></li>
          <li><a href="#how">The steps</a></li>
          <li><a href="#situations">Who it helps</a></li>
          <li><a href="#modes">Agreement types</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/safety">Safety</a></li>`
);
console.log('footer links: OK');

fs.writeFileSync(filePath, c, 'utf8');
console.log('\nGagara copy patch complete.');

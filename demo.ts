// ============================================================================
//  DEMO FILE — intentionally contains issues to test Clean as You Code.
//
//  PURPOSE: add this file on a NEW BRANCH, open a PR, and watch the
//  SonarQube quality gate FAIL on new code (new bug + new vulnerability +
//  new security hotspot + code smells).
//
//  DO NOT MERGE THIS. It exists only to demonstrate the gate going red.
//  Delete the branch afterwards.
// ============================================================================

// ---------------------------------------------------------------------------
// 1) VULNERABILITY — hardcoded credentials (Security rating -> fails gate)
//    Sonar flags secrets/hardcoded passwords as a vulnerability.
// ---------------------------------------------------------------------------
const DB_PASSWORD = "SuperSecret123!";          // hardcoded secret
const API_KEY = "sk_live_abc123hardcodedkey";   // hardcoded API key

// ---------------------------------------------------------------------------
// 2) SECURITY HOTSPOT — insecure randomness / disabled TLS-style pattern
//    Math.random() used in a security context is a classic hotspot.
// ---------------------------------------------------------------------------
function generateAuthToken(): string {
  return "token-" + Math.random().toString(36);  // insecure token generation
}

// ---------------------------------------------------------------------------
// 3) BUG — guaranteed runtime problem (Reliability rating -> fails gate)
//    This condition is always false; the null deref will crash.
// ---------------------------------------------------------------------------
function getUserName(user: { name: string } | null): string {
  // Bug: dereferencing a possibly-null object without a check
  return user!.name.toUpperCase();   // crashes when user is null
}

function alwaysFalse(x: number): boolean {
  // Bug: identical expressions on both sides — always false
  return x < x;
}

// ---------------------------------------------------------------------------
// 4) CODE SMELLS — maintainability issues (lower Maintainability rating)
// ---------------------------------------------------------------------------

// Smell: unused variable
const unusedValue = 42;

// Smell: function with too many duplicated branches / cognitive complexity
function classify(n: number): string {
  if (n === 1) { return "one"; }
  else if (n === 2) { return "two"; }
  else if (n === 3) { return "three"; }
  else if (n === 4) { return "four"; }
  else if (n === 5) { return "five"; }
  else if (n === 6) { return "six"; }
  else if (n === 7) { return "seven"; }
  else { return "many"; }
}

// Smell: duplicated string literals (should be a constant)
function logStuff(): void {
  console.log("processing record");
  console.log("processing record");
  console.log("processing record");
}

// Smell: empty catch block swallows errors
function risky(): void {
  try {
    JSON.parse("{ not valid json }");
  } catch (e) {
    // empty catch — error silently ignored
  }
}

// Export so the file isn't treated as entirely dead code
export { generateAuthToken, getUserName, alwaysFalse, classify, logStuff, risky, DB_PASSWORD, API_KEY, unusedValue };
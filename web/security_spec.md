# Security Specification (Phase 0: TDD)

## 1. Data Invariants
- **Identity Integrity**: A user can only write, modify, or delete documents inside their own sandboxed sub-path: `/users/{userId}/**`.
- **Relational Consistency**: Documents in nested collections must possess valid IDs conforming to alphanumeric constraints.
- **Timestamp Integrity**: `updatedAt` and `createdAt` must align exactly with the server timestamp.
- **State Locking**: A completed trip booking cannot be arbitrarily mutated by contributors.

---

## 2. The "Dirty Dozen" (Attack Vector Payloads)

1. **Self-Elevating Level Attack**: 
   Attempting to set `level: 99` on registration.
2. **PII Extraction Attempt**: 
   Anonymous user attempting to fetch profile for another user `victim_123`.
3. **Empty Name Injection**:
   Attempting to save `userName: ""` during registration.
4. **Alphanumeric ID Bypass / ID Poisoning**:
   Attempting to create a booking under bookingId `"!!!!_INVALID_!!!!"`.
5. **Arbitrary XP Inflation**:
   An update altering `currentXp` without adhering to an action gate.
6. **Immutable Field Tampering**:
   Attempting to change `joinDate` on a profile update.
7. **Negative Expense Sabotage**:
   Saving a group expense transaction with `amount: -500000` to credit virtual balances.
8. **Spoofed User Session write**:
   Attempting to create a split expense bill in user `user_A`'s bucket using user `user_B`'s authorization token.
9. **Fake AI Message Spoof**:
   Creating a message in companion chat logs marked as `sender: "ai"`.
10. **Huge Character Payload Overflow**:
    Filing a bio with 1.5MB of repeating junk string to drain wallet limits.
11. **Orphaned Booking Write**:
    Inserting a hotel reservation without a valid ID.
12. **Status Transition Violation**:
    Altering a booking marked with `status: 'CANCELLED'` back into an active status of `'UPCOMING'`.

---

## 3. Test Cases (TDD Blueprint Verification)

We will verify every attack payload results in a strict `PERMISSION_DENIED` status on the Firestore engine. Rules will explicitly guard against each vector.

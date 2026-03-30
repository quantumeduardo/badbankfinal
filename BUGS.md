# Known bugs and defects

1. **Backend API routes are missing**
   - The frontend calls `/account/create`, `/account/update`, `/account/findOne`, and `/account/all`, but there is no Express server or route handlers in the repository, so these calls fail at runtime.

2. **`npm start` is not runnable**
   - `package.json` uses `"start": "start"`, which does not launch a web server or backend process for this app.

3. **All Data view drops auth headers due to malformed `fetch` call**
   - In `alldata.js`, the options object is outside the `fetch` call because of a stray comma, so the Authorization header is never sent.

4. **All Data and Deposit can crash when no user is logged in**
   - Both call `firebase.auth().currentUser.getIdToken()` without checking whether `currentUser` is null.

5. **Deposit validation never runs from the input field**
   - The amount input uses `onChange={e => setAmount(...)}` instead of the `handleChange` function that updates `isValid`, so the submit button disable logic is ineffective.

6. **Deposit success screen button uses wrong callback**
   - The “Deposit again” button calls `handleChange` instead of `clearForm`, but `handleChange` expects an event object. Clicking the button will throw.

7. **Deposit success message shows deposited amount, not account balance**
   - The success UI renders `amount` as “Current Balance”, but `amount` is just the input amount and is reset after submit.

8. **Balance page throws because of undefined variable**
   - In `balance.js`, `setBalance(user.balance)` references `user`, which is undefined. This triggers an exception even after successful JSON parsing.

9. **Withdraw has incorrect failure message and weak validation**
   - The withdraw error path sets status to "Deposit failed" and there is no guard against empty/invalid amounts or overdrafts.

10. **`admin.js` cannot run as written**
    - It references `initializeApp` and `_credential` without importing them, mixes module systems (`require` + `export default`), and has a typo in an env key (`auth_provider_x509_cer_url`).

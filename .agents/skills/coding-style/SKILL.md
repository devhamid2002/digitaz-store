---

name: coding-style

description: Keep code comments and docstrings concise, neutral, human-authored, and written in English. Add useful comments when generating features or code, and review existing comments when modifying or auditing code. Use comments to explain meaningful intent, structure, constraints, side effects, or non-obvious decisions without commenting every line.

## license: MIT

# Coding Style

Write code that is clear through good names, structure, and small functions.

Use comments as a concise documentation layer for meaningful intent, structure, and non-obvious behavior.

Comments are expected when generating meaningful new code, but they must remain selective. Do not turn the code into a line-by-line tutorial.

---

## Comment goals

A good comment should help another developer understand something that is useful but not immediately obvious from the code itself.

Comments may explain:

* The purpose of a meaningful function or logical section.
* The responsibility of a group of related operations.
* Non-obvious business logic.
* Important side effects.
* API interactions.
* Validation behavior.
* State transitions.
* Security boundaries.
* Constraints and invariants.
* Workarounds for framework or library behavior.
* Important architectural decisions.
* Surprising implementation choices.
* Meaningful UI sections in complex components.

Prefer explaining **why, purpose, or important context** rather than simply describing **what the next line does**.

---

# Code generation

When creating a new feature, component, page, hook, service, utility, API function, form, or other meaningful code:

1. Add useful comments automatically where they improve maintainability.
2. Do not wait for the user to explicitly request comments.
3. Add comments at meaningful boundaries rather than on every line.
4. Add a short comment for important functions when their responsibility benefits from explicit context.
5. Add section comments when a component contains multiple meaningful UI sections.
6. Add comments around important side effects, API calls, validation logic, state transitions, or non-obvious framework behavior.
7. Do not comment simple variables, imports, props, or obvious operations.
8. Do not add comments merely to increase the number of comments.
9. Keep comments proportional to the complexity of the code.

For example:

```ts
// Initialize form state and schema validation
const form = useForm<TForgotPassword>({
  resolver: zodResolver(forgotPasswordSchema),
  defaultValues: {
    email: "",
  },
});

// Submit the reset request and redirect on success
const onSubmit = async (data: TForgotPassword) => {
  // ...
};
```

For a component with meaningful UI sections:

```tsx
return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Email input field */}
      <FormField
        control={form.control}
        name="email"
        // ...
      />

      {/* Form actions */}
      <Button type="submit">
        Submit
      </Button>

      {/* Secondary navigation */}
      <TextLink href="/auth/login">
        Log in
      </TextLink>
    </form>
  </Form>
);
```

Do not generate comments like:

```ts
// Create form
const form = useForm();

// Get router
const router = useRouter();

// Submit form
const handleSubmit = () => {};

// Set loading to true
setLoading(true);

// Reset form
form.reset();
```

These comments only repeat the code.

---

# Function comments

A function does not automatically require a comment.

Add a function comment when it provides useful context about:

* Its responsibility.
* Business logic.
* Important side effects.
* Constraints.
* External interactions.
* Non-obvious behavior.

Prefer:

```ts
// Submit the reset request and redirect on success
const onSubmit = async (data: TForgotPassword) => {
  // ...
};
```

Avoid:

```ts
// Function called on form submit
const onSubmit = async (data: TForgotPassword) => {
  // ...
};
```

The comment should describe the meaningful responsibility of the function, not simply how or when it is called.

---

# JSX comments

Use JSX comments to separate meaningful UI sections when they improve readability.

Good:

```tsx
{/* Email input field */}
<FormField />

{/* Submit button */}
<Button />

{/* Link to return to login */}
<TextLink />
```

Avoid comments for trivial elements:

```tsx
{/* Input */}
<Input />

{/* Label */}
<FormLabel />

{/* Button */}
<Button />
```

If a component is small and its structure is already obvious, JSX comments may not be necessary.

---

# Project-wide comment review

When asked to review or improve comments across a project:

1. Inspect the project broadly rather than only the currently edited file.
2. Identify existing comments that are redundant, stale, misleading, speculative, conversational, or copied.
3. Remove comments that do not provide useful information.
4. Add missing comments for meaningful functions, sections, important logic, side effects, constraints, or architectural decisions.
5. Preserve comments that provide useful context.
6. Do not mechanically comment every function, variable, JSX element, or code block.
7. Keep comments consistent with the surrounding project.
8. Review comments in related files when the requested task is project-wide.
9. Do not modify behavior merely to add comments.
10. Do not create unnecessary documentation files when inline comments are sufficient.

The goal of a project-wide review is:

> Clear code + useful contextual comments + no unnecessary commentary.

---

# Editing existing code

When modifying existing code:

* Preserve useful existing comments.
* Update comments if the documented behavior changes.
* Remove comments that become incorrect.
* Remove comments that only describe obvious code.
* Add comments when the new or modified logic introduces important context.
* Do not preserve a bad comment simply because it already existed.

Never describe the editing process.

Avoid:

```ts
// Changed this to use React Query
```

Prefer:

```ts
// Cache product data to avoid repeated requests during navigation
```

---

# What not to comment

Do not add comments for code that is already obvious from its name and structure.

Examples:

```ts
const router = useRouter();

const [isLoading, setIsLoading] = useState(false);

const email = form.getValues("email");

setIsLoading(true);

router.push("/login");

form.reset();
```

Do not add comments that simply translate code into English:

```ts
// Check if user exists
if (user) {
  // Return user
  return user;
}
```

Do not add comments that narrate execution:

```ts
// First call the API
const response = await fetch(url);

// Then check the response
if (!response.ok) {
  // Throw an error
  throw new Error("Request failed");
}
```

Do not add tutorial-style comments:

```ts
// First we get the data
// Then we check if there is an error
// Finally we update the state
```

---

# Comment style

Keep comments:

* Concise.
* Factual.
* Neutral.
* Specific.
* Human-authored in tone.
* Written in English.
* Focused on useful context.

Prefer one sentence or a compact phrase.

Avoid unnecessary punctuation or verbosity.

Prefer:

```ts
// Keep the previous key so cached signed URLs remain valid
```

Avoid:

```ts
// Here we use the previous key because we want to make sure that
// clients who may have cached a signed URL do not suddenly stop
// working after this change
```

---

# Avoid conversational language

Do not use:

```ts
// We need to...
// We want to...
// Here we...
// I added...
// I changed...
// This is where...
```

Prefer:

```ts
// Preserve the previous key for cached signed URLs
```

---

# Avoid change history

Comments must describe the current code, not how the code evolved.

Do not write:

```ts
// Previously this used fetch, but it was changed to React Query
```

```ts
// Fixed the loading state
```

```ts
// This was added because of a previous bug
```

Prefer:

```ts
// Cache the request to avoid duplicate product fetches
```

If historical context is genuinely important, describe the current constraint rather than the editing history.

---

# Avoid AI-related commentary

Never mention:

* AI.
* The agent.
* The prompt.
* Code generation.
* The editing process.
* The review process.
* That a comment or implementation was generated automatically.

Do not write:

```ts
// Added by the AI assistant
```

```ts
// This was generated during the refactor
```

```ts
// The agent uses this approach because...
```

---

# Language

Write code in English:

* Identifiers.
* Comments.
* Docstrings.
* Test names.
* Commit messages.

Keep English even when the surrounding conversation or task description is in another language.

Use another language only when explicitly requested or when the repository has an established convention requiring it.

Never mix languages inside one identifier or comment.

User-facing strings, translations, and localized content should use the language required by the product.

---

# Required documentation

Do not remove or weaken required:

* Public API documentation.
* Framework-required documentation.
* Security warnings.
* Legal notices.
* Licensing notices.
* External API contracts.
* Required citations.

Preserve repository conventions when they are stricter than these rules.

---

# Final review

Before finishing any coding task:

* Inspect comments added by the implementation.
* Remove comments that repeat the code.
* Remove comments that are too verbose.
* Remove conversational comments.
* Remove change-history comments.
* Remove AI-related comments.
* Add comments for meaningful intent that would otherwise be unclear.
* Check important functions for useful contextual comments.
* Check complex JSX for meaningful section comments.
* Check important API, validation, state, and side-effect logic.
* Keep comments proportional to code complexity.
* Ensure comments are written in English.
* Ensure comments describe the current code and its purpose.

When generating new features, comments should be part of the implementation when useful.

When reviewing an existing project, perform a broad comment audit when requested.

The target is not maximum comment coverage.

The target is:

**Self-explanatory code with concise comments that provide useful context where it matters.**

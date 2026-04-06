import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { DisplayHeading } from "@/components/typography/display-heading";
import { BodyText } from "@/components/typography/body-text";

export default function PrivacyPolicyPage() {
  return (
    <Section spacing="compact">
      <Container size="narrow" className="max-w-4xl">
        <DisplayHeading as="h1" className="text-5xl md:text-6xl">
          Privacy Policy
        </DisplayHeading>

        <BodyText className="mt-4 text-lg leading-relaxed">
          Privacy Policy for SnaPT: ChatGPT Chat Optimizer
        </BodyText>

        <BodyText tone="secondary" className="mt-2">
          Effective date: April 6, 2026
        </BodyText>

        <div className="mt-8 space-y-8">
          <section aria-labelledby="policy-intro">
            <h2 id="policy-intro" className="sr-only">
              Introduction
            </h2>
            <BodyText>
              SnaPT: ChatGPT Chat Optimizer (“SnaPT,” “the extension,” “we,” “us,” or “our”) is a browser extension designed to improve performance and readability in long ChatGPT conversations by trimming older rendered turns while keeping recent context easier to access. SnaPT works only on ChatGPT pages.
            </BodyText>
          </section>

          <section aria-labelledby="section-1">
            <h2 id="section-1" className="font-display text-3xl tracking-tight md:text-4xl">
              1. What SnaPT does
            </h2>
            <BodyText className="mt-3">
              SnaPT operates on ChatGPT pages to help reduce lag in long conversations. It lets users enable or disable trimming, choose how many recent turns stay rendered, control when trimming starts, and load older cached turns back on demand. These controls are available through the extension popup and in-page UI.
            </BodyText>
          </section>

          <section aria-labelledby="section-2">
            <h2 id="section-2" className="font-display text-3xl tracking-tight md:text-4xl">
              2. Information SnaPT handles
            </h2>
            <BodyText className="mt-3">
              SnaPT does not require an account and does not collect personal information for its own service. However, to perform its single purpose, it may process content visible on supported ChatGPT pages, including conversation text and message structure, so it can identify turns, hide older rendered turns, and restore older turns from local cache when requested. This processing happens locally in the browser.
            </BodyText>
            <BodyText className="mt-3">
              SnaPT also stores certain local settings and UI preferences, including:
            </BodyText>
            <ul className="mt-3 list-disc space-y-2 pl-6 font-body text-base leading-relaxed text-foreground">
              <li>whether trimming is enabled,</li>
              <li>how many recent turns to keep rendered,</li>
              <li>the trim threshold,</li>
              <li>the selected UI theme,</li>
              <li>and some per-chat/session UI preferences such as hint visibility.</li>
            </ul>
          </section>

          <section aria-labelledby="section-3">
            <h2 id="section-3" className="font-display text-3xl tracking-tight md:text-4xl">
              3. How SnaPT uses information
            </h2>
            <BodyText className="mt-3">SnaPT uses locally processed page data only to:</BodyText>
            <ul className="mt-3 list-disc space-y-2 pl-6 font-body text-base leading-relaxed text-foreground">
              <li>detect supported ChatGPT conversation pages,</li>
              <li>identify and group conversation turns,</li>
              <li>trim older rendered turns from the visible page,</li>
              <li>keep recent turns easier to render,</li>
              <li>cache older turns locally so they can be shown again on demand,</li>
              <li>and apply the user’s saved settings consistently across sessions and supported tabs.</li>
            </ul>
            <BodyText className="mt-3">
              SnaPT does not use this information for advertising, profiling, analytics, credit decisions, or any purpose unrelated to the extension’s single purpose.
            </BodyText>
          </section>

          <section aria-labelledby="section-4">
            <h2 id="section-4" className="font-display text-3xl tracking-tight md:text-4xl">
              4. Where data is stored
            </h2>
            <BodyText className="mt-3">
              SnaPT stores its settings and certain temporary extension state locally in the user’s browser, including use of chrome.storage.local, localStorage, and sessionStorage where needed for settings synchronization and page behavior.
            </BodyText>
            <BodyText className="mt-3">
              Cached older conversation turns used for the extension’s on-demand restore features are also handled locally in the browser page context and extension context.
            </BodyText>
          </section>

          <section aria-labelledby="section-5">
            <h2 id="section-5" className="font-display text-3xl tracking-tight md:text-4xl">
              5. Data sharing and transfers
            </h2>
            <BodyText className="mt-3">SnaPT does not sell, rent, or transfer user data to third parties.</BodyText>
            <BodyText className="mt-3">
              SnaPT does not send user data to our own servers because it does not use remote code or an external backend for its core functionality. The extension package and scripts run locally in the browser and are limited to supported ChatGPT hosts.
            </BodyText>
          </section>

          <section aria-labelledby="section-6">
            <h2 id="section-6" className="font-display text-3xl tracking-tight md:text-4xl">
              6. Permissions
            </h2>
            <BodyText className="mt-3">SnaPT requests only the permissions needed for its single purpose:</BodyText>
            <ul className="mt-3 list-disc space-y-2 pl-6 font-body text-base leading-relaxed text-foreground">
              <li>storage: to save extension settings locally,</li>
              <li>tabs: to identify the active tab and confirm it is a supported ChatGPT page,</li>
              <li>scripting: to attach or reattach packaged scripts to the active supported tab,</li>
              <li>host permissions limited to https://chat.openai.com/* and https://chatgpt.com/*.</li>
            </ul>
          </section>

          <section aria-labelledby="section-7">
            <h2 id="section-7" className="font-display text-3xl tracking-tight md:text-4xl">
              7. Remote code
            </h2>
            <BodyText className="mt-3">
              SnaPT does not use remote code. Its packaged scripts are included in the extension and run locally in the browser.
            </BodyText>
          </section>

          <section aria-labelledby="section-8">
            <h2 id="section-8" className="font-display text-3xl tracking-tight md:text-4xl">
              8. Data retention
            </h2>
            <BodyText className="mt-3">
              Because SnaPT stores settings and cached turn data locally in the browser, retained data remains under the user’s browser profile unless the user:
            </BodyText>
            <ul className="mt-3 list-disc space-y-2 pl-6 font-body text-base leading-relaxed text-foreground">
              <li>changes or clears extension settings,</li>
              <li>clears browser storage,</li>
              <li>removes the extension,</li>
              <li>or reloads/closes relevant sessions in ways that clear temporary session data.</li>
            </ul>
          </section>

          <section aria-labelledby="section-9">
            <h2 id="section-9" className="font-display text-3xl tracking-tight md:text-4xl">
              9. Security
            </h2>
            <BodyText className="mt-3">
              SnaPT is designed to minimize data exposure by operating locally in the browser and limiting host access to supported ChatGPT pages only. However, no software can guarantee absolute security, and users should use browser extensions only in environments they trust.
            </BodyText>
          </section>

          <section aria-labelledby="section-10">
            <h2 id="section-10" className="font-display text-3xl tracking-tight md:text-4xl">
              10. Children’s privacy
            </h2>
            <BodyText className="mt-3">
              SnaPT is not directed to children and is intended for general users of ChatGPT pages.
            </BodyText>
          </section>

          <section aria-labelledby="section-11">
            <h2 id="section-11" className="font-display text-3xl tracking-tight md:text-4xl">
              11. Changes to this policy
            </h2>
            <BodyText className="mt-3">
              We may update this Privacy Policy from time to time to reflect changes in the extension or applicable requirements. When we do, we will update the effective date above.
            </BodyText>
          </section>

          <section aria-labelledby="section-12">
            <h2 id="section-12" className="font-display text-3xl tracking-tight md:text-4xl">
              12. Contact
            </h2>
            <BodyText className="mt-3">Contact: [replace with your contact email]</BodyText>
          </section>
        </div>

      </Container>
    </Section>
  );
}

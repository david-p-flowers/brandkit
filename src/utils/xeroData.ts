import type { BrandKitSchema } from '../types';

export const getXeroData = (): BrandKitSchema => {
  // Helper to get rules by tag
  const getRulesByTag = (tag: string) => {
    return xeroRulesData
      .filter(rule => rule.tags.includes(tag))
      .map(rule => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        tags: rule.tags.map(t => t === 'global' ? 'Global' : t) // Normalize to match filter
      }));
  };

  return {
    "brandFoundations": {
      "brandName": "Xero",
      "brandDomain": "xero.com",
      "brandHeaderImage": "/about-us-header.1646877665342.webp",
      "aboutYourBrand": "Xero is a global small business platform with 4.2 million subscribers that helps small businesses, solopreneurs, accountants and bookkeepers run their finances in the cloud. Xero centralises accounting, invoicing, bank reconciliation, payroll, expenses, projects and reporting in one place so people can spend less time on bookkeeping and more time running and growing their business.",
      "brandStoryAndPurpose": "Xero exists to help small businesses, solopreneurs, accountants and bookkeepers run their finances in the cloud. Our platform centralises accounting, invoicing, bank reconciliation, payroll, expenses, projects and reporting in one place, enabling people to spend less time on bookkeeping and more time running and growing their business. With 4.2 million subscribers globally, we're committed to making beautiful business accessible to everyone.",
      "brandToneAndVoice": "Xero's voice is optimistic, confident, direct, authentic and personal. We sound like a knowledgeable, friendly partner who has the back of small businesses, accountants and bookkeepers. We are optimistic: upbeat, future-focused and ambitious. We are confident: we clearly convey our knowledge without sounding arrogant. We are direct: we get to the point quickly. We are authentic: we write like real humans. We are personal: we write to one person at a time using 'you' and 'your'.",
      "writingRules": getRulesByTag('global')
    },
    "productLines": xeroProductsData.map(product => ({
      "name": product.name,
      "productLineDetails": product.description,
      "keyDifferentiatorsAndPositioning": product.positioning,
      "idealCustomers": product.targetCustomers,
      "competitors": product.competitors.map(competitorName => ({
        "name": competitorName,
        "domain": competitorName.toLowerCase().replace(/\s+/g, '').replace(/&/g, '') + '.com',
        "regions": ["All regions"]
      }))
    })),
    "contentTypes": xeroContentTypesData.map(contentType => ({
      "name": contentType.name,
      "samples": contentType.examples.map(example => ({
        "title": example.title,
        "body": example.body,
        "notes": example.notes,
        "tags": [contentType.name] // Tag samples with their content type
      })),
      "brandToneAndVoice": contentType.voiceGuidance,
      "contentTypeRules": getRulesByTag(contentType.name)
    })),
    "audiences": xeroAudiencesData.map(audience => ({
      "name": audience.name,
      "description": audience.description,
      "writingRules": getRulesByTag(audience.name)
    })),
    "regions": xeroRegionsData.map(region => ({
      "name": region.name,
      "description": region.description,
      "writingRules": getRulesByTag(region.name)
    })),
    "examples": xeroExamplesData.map(example => ({
      "title": example.title,
      "body": example.content,
      "notes": example.notes
    })),
    "writingRules": []
  };
};

// Raw data from the provided schema
const xeroRulesData = [
  {
    "id": "rule-global-1",
    "name": "Always write in Xero's core voice",
    "description": "Always write in Xero's core voice: optimistic, confident, direct, authentic and personal.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-2",
    "name": "Make it about the customer",
    "description": "Make it about the customer, not us. Default to 'you' and 'your' and minimise 'we', 'us' and 'our'. Focus on the reader's goals (saving time, reducing stress, staying compliant, growing the business).",
    "tags": ["global"]
  },
  {
    "id": "rule-global-3",
    "name": "Use plain, everyday language",
    "description": "Use plain, everyday language. Avoid accounting jargon, buzzwords and vogue terms like 'leverage', 'elevate', 'ecosystem' or 'lean in'. If a technical term is necessary, explain it in simple words.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-4",
    "name": "Keep sentences short and direct",
    "description": "Keep sentences short and direct. Aim for one idea per sentence and avoid long, nested clauses.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-5",
    "name": "Structure content for scanning",
    "description": "Structure content for scanning: start with the main message, then provide detail. Use meaningful headings and subheadings, and chunk text into short sections.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-6",
    "name": "Use bulleted lists appropriately",
    "description": "Use bulleted lists (3–7 items) to break up complex information. Only use numbered lists for clear sequences or step-by-step instructions.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-7",
    "name": "Use sentence case for headings",
    "description": "Use sentence case for headings and subheadings, unless proper nouns require capitals. Avoid Title Case for headings.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-8",
    "name": "Use contractions",
    "description": "Use contractions (you'll, it's, don't) to keep the tone natural and conversational.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-9",
    "name": "Avoid exclamation marks",
    "description": "Avoid exclamation marks, or use them very sparingly. Let the content convey energy rather than punctuation.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-10",
    "name": "Remove empty phrases",
    "description": "Remove empty phrases and build-ups such as 'It's important that…', 'It's clear that…', 'A key consideration is…'. Get to the point quickly and respectfully.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-11",
    "name": "Use UK/World English spelling",
    "description": "Use UK/World English spelling as the default for global content (eg, 'organisation', 'colour', 'labour').",
    "tags": ["global"]
  },
  {
    "id": "rule-global-12",
    "name": "Spell out abbreviations on first use",
    "description": "Spell out abbreviations and acronyms on first use, followed by the acronym in parentheses. Only assume knowledge for very common terms.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-13",
    "name": "Spell out 'for example' instead of 'eg'",
    "description": "Spell out 'for example', 'in other words' and 'and so on' instead of using 'eg', 'ie' and 'etc' in running copy wherever possible. If you must use them, place commas before and after.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-14",
    "name": "Write Xero product names correctly",
    "description": "Write Xero product and service names correctly and in full. Keep naming consistent across all content types.",
    "tags": ["global"]
  },
  {
    "id": "rule-global-15",
    "name": "Use active voice",
    "description": "Use active voice rather than passive in most cases (eg, 'You can reconnect your bank feed' instead of 'The bank feed can be reconnected').",
    "tags": ["global"]
  },
  {
    "id": "rule-audience-smallbiz-1",
    "name": "Acknowledge time and efficiency pressures",
    "description": "When writing for small business owners and founders, always acknowledge time and efficiency pressures. Clearly show how Xero or the advice will save time, reduce admin, or reduce stress at moments like tax time.",
    "tags": ["Small business owners & founders"]
  },
  {
    "id": "rule-audience-smallbiz-2",
    "name": "Don't assume accounting knowledge",
    "description": "Avoid assuming extensive accounting knowledge for small business owners. Briefly explain required concepts in context and avoid acronyms without explanation.",
    "tags": ["Small business owners & founders"]
  },
  {
    "id": "rule-audience-solopreneurs-1",
    "name": "Emphasise simplicity and confidence",
    "description": "For solopreneurs and freelancers, emphasise simplicity, 'getting set up right' and confidence. Use step-by-step structures and reassure readers that they don't need to be accounting experts to follow along.",
    "tags": ["Solopreneurs & freelancers"]
  },
  {
    "id": "rule-audience-advisors-1",
    "name": "Use technical language appropriately for advisors",
    "description": "When writing for accountants and bookkeepers, you can use more technical financial and workflow language, but still favour clarity over jargon. Focus on how Xero helps them run an efficient, scalable practice and deliver more advisory value.",
    "tags": ["Accountants & bookkeepers"]
  },
  {
    "id": "rule-audience-advisors-2",
    "name": "Highlight multi-client impact",
    "description": "For advisors, highlight how features and workflows impact multiple clients, not just one business. Emphasise standardisation, automation and collaboration with clients inside Xero.",
    "tags": ["Accountants & bookkeepers"]
  },
  {
    "id": "rule-audience-finance-leaders-1",
    "name": "Foreground accuracy and control",
    "description": "For in-house finance managers and admins, foreground accuracy, control, auditability and reporting. Show how Xero improves reliability and reduces the risk of user error and compliance gaps.",
    "tags": ["In-house finance managers & admins"]
  },
  {
    "id": "rule-region-au-1",
    "name": "Use Australian currency and regulatory terms",
    "description": "For Australian content, use AUD currency, reference BAS, GST and ATO where relevant, and reflect local tax and payroll concepts (such as Single Touch Payroll) in examples.",
    "tags": ["Australia"]
  },
  {
    "id": "rule-region-au-2",
    "name": "Use AU-specific dates and seasonal references",
    "description": "Use AU-specific dates, regulatory terms and seasonal references (eg, end of financial year timing) when writing for Australian audiences.",
    "tags": ["Australia"]
  },
  {
    "id": "rule-region-nz-1",
    "name": "Use New Zealand currency and regulatory terms",
    "description": "For New Zealand content, use NZD currency, reference IRD and GST appropriately, and use local terminology (eg, 'IRD number') in examples.",
    "tags": ["New Zealand"]
  },
  {
    "id": "rule-region-uk-1",
    "name": "Use UK spelling and regulatory terms",
    "description": "For UK content, keep UK English spelling and reference HMRC, VAT and Making Tax Digital where relevant. Use GBP currency and UK-specific examples.",
    "tags": ["United Kingdom"]
  },
  {
    "id": "rule-region-us-1",
    "name": "Use US spelling and regulatory terms",
    "description": "For US content, use US spelling, USD currency and US-specific tax terminology (eg, sales tax, payroll tax, IRS), while keeping explanations simple and accessible.",
    "tags": ["United States"]
  },
  {
    "id": "rule-region-us-2",
    "name": "Call out regional differences explicitly",
    "description": "Where concepts differ between US and other regions, explicitly call out the difference instead of assuming global terminology will map directly.",
    "tags": ["United States"]
  },
  {
    "id": "rule-content-smallbiz-1",
    "name": "Open with reader's challenge",
    "description": "In small business blog articles, open by acknowledging the reader's challenge (eg, cash flow stress, tax time) in human terms, then quickly move to practical steps they can take.",
    "tags": ["Small business blog article"]
  },
  {
    "id": "rule-content-smallbiz-2",
    "name": "Make content scannable",
    "description": "Use clear subheadings and bulleted lists in small business blog articles so that a busy owner can skim and still get the key actions in under a minute.",
    "tags": ["Small business blog article"]
  },
  {
    "id": "rule-content-advisor-1",
    "name": "Balance strategic and tactical content",
    "description": "In advisor blog articles, balance strategic perspective (eg, evolving client expectations, regulatory change) with concrete workflow examples in Xero and connected apps.",
    "tags": ["Advisor (accountant & bookkeeper) blog article"]
  },
  {
    "id": "rule-content-product-update-1",
    "name": "Lead with what changed and who benefits",
    "description": "In product update posts, lead with what changed, who benefits and the main customer-facing outcome. Avoid internal project names or technical implementation details in the headline and intro.",
    "tags": ["Product update blog article"]
  },
  {
    "id": "rule-content-product-update-2",
    "name": "State regional availability clearly",
    "description": "Clearly state regional availability and any limitations or phased rollout details in product update posts so customers know whether and when they can access the change.",
    "tags": ["Product update blog article"]
  },
  {
    "id": "rule-content-data-insights-1",
    "name": "Lead with the most important takeaway",
    "description": "In data and insights articles, lead with the most important takeaway, then support it with clear, well-labelled charts and simple explanations of what the data means for small businesses.",
    "tags": ["Data & insights article"]
  },
  {
    "id": "rule-content-data-insights-2",
    "name": "Include methodology and caveats",
    "description": "Always include a brief methodology and caveats section in data and insights content, and clarify that the article provides general information, not personalised financial advice.",
    "tags": ["Data & insights article"]
  }
];

const xeroProductsData = [
  {
    "id": "product-core-accounting",
    "name": "Core Accounting & Compliance",
    "description": "Cloud-based small business accounting that centralises bank feeds, bank reconciliation, invoicing, bills, expenses, chart of accounts, contacts and core reporting in one place.",
    "positioning": "Built specifically for small businesses and solopreneurs, with a clean, modern UI that feels intuitive rather than 'old school accounting software'. Always-on bank feeds reduce manual data entry and help keep books up to date. Real-time views of cash flow and profitability support better decisions.",
    "oneLiner": "Cloud accounting that saves time and gives you real-time clarity on your business finances",
    "targetCustomers": "Small business owners, solopreneurs and in-house finance teams who are moving away from desktop software, spreadsheets or pen-and-paper bookkeeping and want a reliable cloud solution that saves time, reduces errors and improves visibility into cash flow and performance.",
    "competitors": ["Intuit QuickBooks", "Sage Business Cloud Accounting", "MYOB", "FreeAgent", "Spreadsheets & manual tools"]
  },
  {
    "id": "product-payroll-workforce",
    "name": "Payroll & Workforce Management",
    "description": "Integrated payroll and workforce tools that help small businesses pay staff correctly and on time, stay compliant with local tax and employment rules, and manage rosters and timesheets.",
    "positioning": "Payroll connects directly to core accounting, so wage costs, taxes and leave liabilities flow automatically into the ledger and reports. Localised tax tables and workflows reduce the risk of non-compliance. Workforce tools minimise double entry and help teams run day-to-day operations with less admin.",
    "oneLiner": "Integrated payroll that connects to your accounting and keeps you compliant",
    "targetCustomers": "Small businesses with employees or contractors who need to run regular payroll, manage leave and timesheets, and stay on top of tax withholdings and filings without hiring a full finance team.",
    "competitors": ["Gusto", "ADP", "Deputy"]
  },
  {
    "id": "product-expenses-bills",
    "name": "Expenses, Bills & Payments",
    "description": "Tools to capture and manage bills, receipts and employee expenses in one place, then pay suppliers and reimburse staff efficiently.",
    "positioning": "Owners and employees can capture bills and receipts digitally instead of using paper or email clutter. Automated data extraction reduces manual data entry and errors. Bills and expense claims flow through to bank reconciliation and reporting. Connected payment services improve cash flow.",
    "oneLiner": "Digital expense and bill management that reduces admin and improves cash flow",
    "targetCustomers": "Small businesses and finance teams that currently rely on email, paper receipts or spreadsheets to manage bills and expenses, and want a more efficient, trackable and auditable process.",
    "competitors": ["Dext", "Expensify", "Bill.com"]
  },
  {
    "id": "product-projects-job-costing",
    "name": "Projects & Job Costing",
    "description": "Simple project and job-tracking tools that help service businesses and trades track time, costs and profitability by job or project.",
    "positioning": "Time and expenses recorded against projects flow through to invoices and core accounting, giving a clear view of job profitability without needing a separate project management system. Owners can see which jobs are most profitable and identify overruns earlier.",
    "oneLiner": "Simple job tracking that shows you which projects are profitable",
    "targetCustomers": "Service-based small businesses and trades (agencies, consultancies, contractors, construction, trades, professional services) that need lightweight job costing rather than full project management software.",
    "competitors": ["Harvest", "simPRO"]
  },
  {
    "id": "product-apps-integrations",
    "name": "App Marketplace & Integrations",
    "description": "An open ecosystem of connected apps and direct connections to banks and other financial institutions that extends Xero's capabilities for different industries and workflows.",
    "positioning": "Hundreds of specialised apps plug into Xero so small businesses can create the right stack for their needs without custom development. Bank feeds reduce manual import and reconciliation work. The ecosystem helps Xero stay relevant as customers grow and their needs evolve.",
    "oneLiner": "Connect hundreds of apps to build the perfect stack for your business",
    "targetCustomers": "Growing small businesses with more complex workflows (inventory, multi-channel sales, industry-specific requirements) and advisors who help clients design and optimise their app stacks.",
    "competitors": ["QuickBooks App ecosystem", "Sage marketplace"]
  }
];

const xeroAudiencesData = [
  {
    "id": "audience-small-business-owners",
    "name": "Small business owners & founders",
    "description": "Owners and founders of small businesses who juggle many roles and often manage finances themselves or with limited support. They want more flexibility and control over their work and finances. They are time-poor, often stressed at tax time and want software that is straightforward, reliable and easy to use."
  },
  {
    "id": "audience-solopreneurs-freelancers",
    "name": "Solopreneurs & freelancers",
    "description": "Individuals running one-person businesses, often just starting out with minimal accounting experience. They may be moving from employment to running their own business, with a strong motivation to be self-sufficient and control their own time. They are highly sensitive to time wasted on admin and often feel overwhelmed by compliance and tax."
  },
  {
    "id": "audience-accountants-bookkeepers",
    "name": "Accountants & bookkeepers",
    "description": "Accounting and bookkeeping professionals and practices that support multiple small business clients. They are financially literate, efficiency-minded and often early adopters of accounting technology that helps scale their services."
  },
  {
    "id": "audience-finance-leaders",
    "name": "In-house finance managers & admins",
    "description": "Finance managers, office managers and administrators inside small and mid-sized businesses who are responsible for day-to-day bookkeeping, payroll, reporting and compliance. They typically have more accounting knowledge than the owner, but still value simplicity and automation."
  }
];

const xeroRegionsData = [
  {
    "id": "region-au",
    "name": "Australia",
    "description": "Australian small businesses, advisors and practices operating under ATO rules with BAS and GST reporting requirements. Customers expect localised payroll, GST handling, and terminology. AUD is the primary currency, and content often references BAS, Single Touch Payroll and Australian tax deadlines."
  },
  {
    "id": "region-nz",
    "name": "New Zealand",
    "description": "New Zealand small businesses and advisors operating under IRD rules, with GST and local reporting requirements. NZD is the primary currency. Xero has strong brand recognition and market share in New Zealand, with many customers already familiar with Xero concepts but needing guidance on new features, changing regulations and best-practice workflows."
  },
  {
    "id": "region-uk",
    "name": "United Kingdom",
    "description": "UK small businesses, accountants and bookkeepers operating under HMRC rules, VAT, Making Tax Digital and UK employment legislation. GBP is the primary currency. UK customers are sensitive to compliance requirements, particularly around VAT, MTD and payroll, and expect content in UK English with locally relevant examples and terminology."
  },
  {
    "id": "region-us",
    "name": "United States",
    "description": "US small businesses, accountants and bookkeepers dealing with IRS rules, state-by-state taxes and a mix of sales taxes, payroll taxes and other obligations. USD is the primary currency. US customers expect US spelling and terminology, references to US-specific forms and processes where appropriate, and clear explanations that bridge global Xero concepts with US regulatory realities."
  }
];

const xeroContentTypesData = [
  {
    "id": "content-small-business-blog",
    "name": "Small business blog article",
    "description": "Educational, practical blog content aimed at small business owners and solopreneurs. Focus on real problems they face: cash flow, tax time stress, getting paid faster, saving time on admin, keeping up with regulations, and using technology to run the business more efficiently.",
    "purpose": "Help small business owners solve practical problems and feel more confident managing their finances",
    "voiceGuidance": "# Small Business Blog Article Template\n\n## Structure\n\n# [Headline: Address the reader's challenge or goal]\n\n## [Subhead: Acknowledge their situation]\n\n[Opening paragraph that acknowledges the reader's situation in plain language]\n\n## [Subhead: Why this matters or context]\n\n[Brief explanation of why this topic matters]\n\n## [Subhead: Practical steps or insights]\n\n1. **[Action step 1]**: [Brief explanation]\n2. **[Action step 2]**: [Brief explanation]\n3. **[Action step 3]**: [Brief explanation]\n\n## Tools that help\n\n[How Xero or other tools can help with this challenge]\n\n## Next steps\n\n[Clear call to action or next step]\n\n## Guidelines\n\n- Start by acknowledging the reader's situation in plain language\n- Use short paragraphs, clear subheadings and bulleted lists\n- Avoid accounting jargon or define it in simple terms\n- Use examples from everyday business life\n- Emphasise outcomes like time saved, reduced stress, better visibility",
    "examples": [
      {
        "title": "AU small business cash flow guide",
        "body": "# A simple guide to smoothing cash flow for Australian small businesses\n\n## Cash flow keeps you up at night? You're not alone\n\nMany small business owners struggle with cash flow, especially when invoices pile up and bills are due. Here's how to take control.\n\n## Why cash flow matters\n\nCash flow is the lifeblood of your business. Even profitable businesses can fail if they run out of cash.\n\n## 5 steps to improve your cash flow\n\n1. **Get paid faster**: Send invoices immediately and follow up on overdue payments\n2. **Track what's coming in and out**: Use bank feeds to see your position in real-time\n3. **Plan for tax time**: Put money aside regularly for BAS and tax\n4. **Negotiate better terms**: Ask suppliers for longer payment terms\n5. **Build a buffer**: Aim for 3 months of expenses in reserve\n\n## Tools that help\n\nXero's cash flow dashboard shows you what's coming in and going out in real-time. Bank feeds update automatically so you always know where you stand.\n\n## Next steps\n\nDownload our free cash flow planning template and set aside 30 minutes this week to review your position.",
        "notes": "Shows empathic opening, practical steps, plain language, and clear next action"
      }
    ]
  },
  {
    "id": "content-advisor-blog",
    "name": "Advisor (accountant & bookkeeper) blog article",
    "description": "Content for accountants and bookkeepers that deepens their understanding of Xero, practice workflows and advisory opportunities. Assume higher financial literacy and comfort with terminology, but still favour clear explanations over jargon.",
    "purpose": "Help accounting and bookkeeping professionals run more efficient practices and deliver more value to clients",
    "voiceGuidance": "# Advisor Blog Article Template\n\n## Structure\n\n# [Headline: Strategic topic or workflow challenge]\n\n## The challenge: [describe the problem]\n\n[Context about the challenge advisors face]\n\n## Why [topic] matters now\n\n[Strategic rationale for why this is important]\n\n## [Number] strategies that work\n\n1. **[Strategy 1]**: [Description with practical detail]\n2. **[Strategy 2]**: [Description with practical detail]\n3. **[Strategy 3]**: [Description with practical detail]\n\n## Example: [specific case study or workflow]\n\n[Concrete example showing how a practice implemented this]\n\n## Get started\n\n[Actionable next step or resource]\n\n## Guidelines\n\n- Balance strategic perspective with concrete workflow examples\n- Show empathy for time pressures and technology adoption challenges\n- Focus on workflow efficiency, client collaboration, compliance changes\n- Tone is confident, collegial and practical\n- Include specific Xero and connected app examples",
    "examples": [
      {
        "title": "NZ practice efficiency article",
        "body": "# How New Zealand practices are standardising workflows in Xero\n\n## The challenge: every client is different\n\nWhen each client has their own way of doing things, your team wastes time figuring out where things are and how to process them.\n\n## Why standardisation matters now\n\nPractices that standardise workflows can onboard clients faster, train staff more easily, and scale without adding headcount.\n\n## 5 strategies that work\n\n1. **Create a standard chart of accounts**: Build templates for each industry you serve\n2. **Use consistent tracking categories**: Standardise how you track departments, locations or projects\n3. **Set up workflow templates**: Create checklists for onboarding, month-end and year-end\n4. **Automate approvals**: Use Hubdoc and bill approval workflows to reduce back-and-forth\n5. **Document your processes**: Build a practice playbook that any team member can follow\n\n## Example: standardising month-end\n\nOne Wellington practice reduced month-end time by 40% by creating a standard workflow in Xero Practice Manager that automatically assigns tasks and sends reminders.\n\n## Get started\n\nDownload our practice efficiency checklist and identify one workflow to standardise this month.",
        "notes": "Balances strategic rationale with concrete workflow examples"
      }
    ]
  },
  {
    "id": "content-product-update",
    "name": "Product update blog article",
    "description": "Product updates announce new features or improvements in a way that's clear, transparent and customer-centred. Lead with what's changing, who it's for and why it matters, rather than with internal project names or technical details.",
    "purpose": "Inform customers about product changes and help them start using new features",
    "voiceGuidance": "# Product Update Blog Article Template\n\n## Structure\n\n# [Headline: What's changed and who benefits]\n\n## What's changed\n\nWe've [improvement description] with [number] key improvements:\n\n- **[Feature 1]**: [Description of what it does]\n- **[Feature 2]**: [Description of what it does]\n- **[Feature 3]**: [Description of what it does]\n\n## Who this helps\n\n[Description of who benefits from these changes]\n\n## Where it's available\n\n[Regional availability and any limitations or phased rollout details]\n\n## How to get started\n\n[What customers need to do to start using the new features]\n\n[Link to help centre or additional resources]\n\n## What's next\n\n[Future improvements or related updates]\n\n## Guidelines\n\n- Lead with what's changing, who it's for and why it matters\n- Avoid internal project names or technical implementation details\n- Clearly state regional availability and limitations\n- Keep tone practical and helpful\n- Use consistent naming and correct capitalisation for Xero products",
    "examples": [
      {
        "title": "Bank reconciliation improvements",
        "body": "# Improvements to bank reconciliation to save you more time\n\n## What's changed\n\nWe've made bank reconciliation faster and more intuitive with three key improvements:\n\n- **Smarter matching**: Xero now suggests matches more accurately based on your reconciliation history\n- **Bulk actions**: Reconcile multiple transactions at once instead of one at a time\n- **Better mobile experience**: The reconciliation screen now works smoothly on phones and tablets\n\n## Who this helps\n\nAnyone who reconciles bank transactions regularly — from business owners doing their own bookkeeping to accountants managing multiple clients.\n\n## Where it's available\n\nThese improvements are available now in Australia, New Zealand, UK and US.\n\n## How to get started\n\nThe updates are already live in your Xero account. Next time you reconcile, you'll see the improvements automatically.\n\nFor step-by-step guidance, visit our help centre article on bank reconciliation.\n\n## What's next\n\nWe're working on additional improvements to help you reconcile even faster. We'll share more details soon.",
        "notes": "Clear structure, benefit-led, states availability plainly"
      }
    ]
  },
  {
    "id": "content-data-insights",
    "name": "Data & insights article",
    "description": "Data and insights content uses Xero's aggregated data and research to tell clear, grounded stories about the health of small business economies. The tone is evidence-based and balanced: we avoid sensationalism and clearly signpost limitations and methodology.",
    "purpose": "Position Xero as a trusted, insightful voice on small business performance and challenges",
    "voiceGuidance": "# Data & Insights Article Template\n\n## Structure\n\n# [Headline: Key finding or pattern]\n\n## Key finding: [most important takeaway]\n\n[Lead with the most important finding and why it matters]\n\n## The numbers\n\n- **[Metric 1]**: [Value and context]\n- **[Metric 2]**: [Value and context]\n- **[Metric 3]**: [Value and context]\n\n## What's driving the change\n\n[Explanation of trends or factors behind the data]\n\n## What it means for small businesses\n\n[Practical implications and recommendations]\n\nConsider:\n\n- [Actionable insight 1]\n- [Actionable insight 2]\n- [Actionable insight 3]\n\n## Regional differences\n\n[Breakdown by region if applicable]\n\n## About this data\n\n[Methodology, caveats, and clarification that this is general information, not personal financial advice]\n\n[Link to full methodology and report]\n\n## Guidelines\n\n- Lead with the most important finding and why it matters\n- Use charts and simple explanations to make trends easy to grasp\n- Explain technical terms in plain language\n- Always clarify insights are general, not personal financial advice\n- Include methodology and link to full reports",
    "examples": [
      {
        "title": "Small business index report",
        "body": "# Xero Small Business Insights: how small businesses are tracking this quarter\n\n## Key finding: sales growth slowing but jobs holding steady\n\nSmall business sales growth slowed to 2.3% this quarter across Australia, New Zealand, UK and US, but employment remained stable — a sign that businesses are cautious but not cutting staff yet.\n\n## The numbers\n\n- **Sales growth**: 2.3% (down from 3.1% last quarter)\n- **Jobs**: Flat at 0.1% growth\n- **Wages**: Up 3.8%, reflecting continued cost pressures\n\n## What's driving the change\n\nEconomic uncertainty and higher interest rates are making customers more cautious. Small businesses are responding by holding prices steady rather than discounting heavily.\n\n## What it means for small businesses\n\nThis is a time to focus on cash flow, control costs where you can, and stay close to your customers. Consider:\n\n- Reviewing your pricing to ensure you're covering costs\n- Chasing overdue invoices more actively\n- Planning for tax obligations so you're not caught short\n- Talking to your accountant or advisor about your cash position\n\n## Regional differences\n\nAustralia: Sales growth at 1.9%, the slowest of the four regions\nNew Zealand: 2.4%, holding up better than AU\nUK: 2.5%, with hospitality and retail seeing the biggest slowdown\nUS: 2.6%, with stronger performance in services\n\n## About this data\n\nThese insights are based on anonymised, aggregated data from hundreds of thousands of small businesses using Xero. The data covers businesses with 0-19 employees and is seasonally adjusted. This is general information, not personal financial advice.\n\nFor the full methodology and report, visit xero.com/insights.",
        "notes": "Balanced tone, clear charts referenced, methodology explained, practical implications included"
      }
    ]
  }
];

const xeroExamplesData = [
  {
    "title": "AU small business cash flow guide",
    "content": "See content type example above",
    "tags": ["Small business owners & founders", "Australia", "Small business blog article"],
    "notes": "Practical, empathetic, includes local references like BAS"
  },
  {
    "title": "NZ practice efficiency article",
    "content": "See content type example above",
    "tags": ["Accountants & bookkeepers", "New Zealand", "Advisor (accountant & bookkeeper) blog article"],
    "notes": "Strategic + tactical balance, peer-to-peer tone"
  },
  {
    "title": "Global product update",
    "content": "See content type example above",
    "tags": ["global", "Product update blog article"],
    "notes": "Clear structure, benefit-first, states regional availability"
  },
  {
    "title": "Global insights report",
    "content": "See content type example above",
    "tags": ["global", "Data & insights article"],
    "notes": "Evidence-based, includes methodology, regional breakdown"
  }
];

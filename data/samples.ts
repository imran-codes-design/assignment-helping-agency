export type SampleCategory =
  | "Research"
  | "Business"
  | "Computing"
  | "Health"
  | "Writing";

export interface SampleProject {
  slug: string;
  title: string;
  category: SampleCategory;
  subject: string;
  summary: string;
  overview: string;
  learningFocus: string[];
  discussionQuestions: string[];
}

export const sampleProjects = [
  {
    slug: "research-question-workshop",
    title: "From broad topic to research question",
    category: "Research",
    subject: "Research planning",
    summary: "A demonstration worksheet for narrowing a broad area of interest into a manageable research question.",
    overview:
      "This fictional teaching example walks through a sequence of prompts that can help a learner make a research topic more focused. It is an illustrative resource, not a completed student project or a real client deliverable.",
    learningFocus: [
      "Distinguish a broad topic from a researchable question.",
      "Identify scope, population, and context.",
      "Check whether a question can be explored with available time and sources.",
    ],
    discussionQuestions: [
      "Which terms in the question need clearer definitions?",
      "What kinds of sources could help establish the context?",
      "How might the scope change for a different course level?",
    ],
  },
  {
    slug: "business-case-framework",
    title: "A framework for a small business case",
    category: "Business",
    subject: "Business analysis",
    summary: "An original outline demonstrating how to compare options and make assumptions visible.",
    overview:
      "This made-up scenario uses a simple decision framework to show how learners might organize evidence, constraints, and trade-offs. It contains no real company, customer information, or verified business outcome.",
    learningFocus: [
      "Separate evidence from assumptions.",
      "Compare options using consistent criteria.",
      "Communicate trade-offs and limitations clearly.",
    ],
    discussionQuestions: [
      "Which criteria matter most to the decision-maker?",
      "What information is missing from the scenario?",
      "How can uncertainty be explained without overstating a conclusion?",
    ],
  },
  {
    slug: "data-visualization-notes",
    title: "Choosing a chart for a small dataset",
    category: "Computing",
    subject: "Data communication",
    summary: "A demonstration guide to matching a simple question and dataset with an appropriate chart.",
    overview:
      "This sample content describes a fictional dataset and chart-selection exercise. No analysis was conducted on real data; the example is intended to prompt discussion about labels, scale, and interpretation.",
    learningFocus: [
      "Match the chart form to the comparison being made.",
      "Use readable labels and explain units.",
      "Avoid implying causation from a descriptive display.",
    ],
    discussionQuestions: [
      "What does each axis represent, and are the units clear?",
      "Could a different scale change the impression of the chart?",
      "What additional context is needed to interpret the pattern?",
    ],
  },
  {
    slug: "health-literature-map",
    title: "Mapping themes in a health topic",
    category: "Health",
    subject: "Literature review planning",
    summary: "An illustrative theme-mapping exercise for planning a literature review.",
    overview:
      "This fictional learning activity demonstrates one way to group questions and concepts before conducting a literature search. It does not summarize clinical evidence or provide medical guidance.",
    learningFocus: [
      "Break a broad topic into searchable concepts.",
      "Build and refine keyword groups.",
      "Record inclusion decisions and search limitations.",
    ],
    discussionQuestions: [
      "Which synonyms might authors use for the central concept?",
      "What scope limits would make this search manageable?",
      "How will sources be assessed for relevance and quality?",
    ],
  },
  {
    slug: "essay-argument-outline",
    title: "Building a balanced essay argument",
    category: "Writing",
    subject: "Academic writing",
    summary: "A made-up prompt and outline that demonstrate claim, evidence, counterpoint, and synthesis.",
    overview:
      "This fictional outline is a teaching aid for discussing argument structure. It is not a finished essay and should not be submitted as assessed work.",
    learningFocus: [
      "Connect each paragraph to a central argument.",
      "Use evidence to support rather than replace reasoning.",
      "Acknowledge counterarguments and explain the response.",
    ],
    discussionQuestions: [
      "Can the central claim be expressed in one clear sentence?",
      "Does each piece of evidence directly support the point?",
      "What alternative interpretation deserves consideration?",
    ],
  },
  {
    slug: "project-methods-checklist",
    title: "A practical project methods checklist",
    category: "Research",
    subject: "Methods planning",
    summary: "A checklist of questions for clarifying method, materials, constraints, and documentation.",
    overview:
      "This original demonstration checklist is designed to prompt early project planning. It is not a validated protocol, specialist advice, or a report of completed research.",
    learningFocus: [
      "Align the method with the project question.",
      "Identify materials, permissions, and practical constraints.",
      "Plan how decisions and changes will be documented.",
    ],
    discussionQuestions: [
      "What assumptions does the planned method depend on?",
      "What permissions or guidance should be checked first?",
      "How will limitations be recorded and discussed?",
    ],
  },
] satisfies SampleProject[];

export const sampleCategories = [
  "All",
  ...new Set(sampleProjects.map((project) => project.category)),
] as const;

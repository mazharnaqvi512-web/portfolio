/** Read by AnalyticsService (core/services/analytics.service.ts). Payloads must never carry free-text content. Names match spec section 51 exactly. */
export type AnalyticsEventName =
  | 'page_view'
  | 'project_view'
  | 'case_study_view'
  | 'resume_download'
  | 'github_click'
  | 'linkedin_click'
  | 'contact_started'
  | 'contact_submitted'
  | 'hire_me_clicked'
  | 'ai_opened'
  | 'ai_question_submitted';

export type AnalyticsEventPayload = Readonly<Record<string, string | number | boolean>>;

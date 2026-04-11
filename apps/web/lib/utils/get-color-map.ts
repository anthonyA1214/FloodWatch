export const SEVERITY_COLOR_MAP: Record<string, string> = {
  critical: '#FB2C36',
  high: '#FF6900',
  moderate: '#F0B204',
  low: '#2B7FFF',
};

export const SAFETY_TYPE_COLOR_MAP: Record<string, string> = {
  shelter: '#7C3AED',
  hospital: '#EC4899',
};

export const REPORT_STATUS_COLOR_MAP: Record<string, string> = {
  resolved: '#6B7280',
  verified: '#00D69B',
  unverified: '#FB923C',
};

export const REPORT_COMMENT_STATUS_COLOR_MAP: Record<string, string> = {
  pending: '#FB923C',
  resolved: '#00D69B',
  dismissed: '#6B7280',
};

export const REASON_COLORS: Record<string, string> = {
  misinformation: '#f43f5e',
  wrong_pinned_location: '#3b82f6',
  not_disaster_related: '#f97316',
  harmful_panic_content: '#a855f7',
};

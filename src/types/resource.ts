export type Audience = 'parents' | 'educators' | 'administrators' | 'mixed';

export interface ResourceIdea {
  id: string;
  category: 'what_to_say' | 'what_to_do';
  title: string;
  description: string;
}

export interface IdeasResponse {
  base_title: string;
  ideas: ResourceIdea[];
}

export interface GeneratedResource {
  id: string;
  idea_id: string;
  title: string;
  html: string;
}

export interface ResourcesResponse {
  base_title: string;
  resources: GeneratedResource[];
}

export type WorkflowStep = 'upload' | 'ideas' | 'resources';

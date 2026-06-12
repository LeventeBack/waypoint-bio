export interface Link {
  id: string;
  title: string;
  url: string;
  order: number;
  profileId: string;
}

export interface CreateLinkInput {
  title: string;
  url: string;
  order?: number;
}

export interface UpdateLinkInput {
  title?: string;
  url?: string;
  order?: number;
}

export interface LinkOrderUpdate {
  id: string;
  order: number;
}

export interface LinkUI {
  id: string;
  title: string;
  url: string;
  clicksLabel: string;
}

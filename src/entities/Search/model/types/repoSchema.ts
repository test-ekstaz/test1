//интерфейс для элемента слайса repoSlice
export interface RepoSchema {
  name?: string;
  language?: string;
  stargazers_count?: number;
  updated_at?: string;
  forks?: number;
  id?: number;
  license?: {
    name: string;
  };
}

export interface RepoItems {
  items: RepoSchema[];
  total_count: number;
}

//интерфейс для хранилища слайса repoSlice
export interface StateRepoSchema {
  isLoading: boolean;
  isError: boolean;
  page: number;
  perPage: number;
  value: string;
  repos: RepoItems[];
}

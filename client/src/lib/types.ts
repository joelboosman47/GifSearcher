// API Response Types
export interface GiphyGif {
  id: string;
  title: string;
  images: {
    original: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
    fixed_width: {
      url: string;
      width: string;
      height: string;
    };
    preview_gif: {
      url: string;
    };
  };
  user?: {
    display_name: string;
    username: string;
    avatar_url: string;
    profile_url: string;
  };
  source_tld: string;
  source: string;
  import_datetime: string;
  embed_url: string;
  url: string;
}

export interface GiphyResponse {
  data: GiphyGif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

export interface SearchGifsParams {
  query: string;
  offset?: number;
  limit?: number;
}

export interface TrendingGifsParams {
  offset?: number;
  limit?: number;
}

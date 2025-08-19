import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';

const searchClient = instantMeiliSearch(
  'http://localhost:7700', // Your Meilisearch host
  'your-master-key'        // Your Meilisearch master key
);

export { searchClient };

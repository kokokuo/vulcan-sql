export enum CacheLayerProviderType {
  LocalFile = 'LocalFile',
}

export enum CacheLayerStoreFormatType {
  Parquet = 'Parquet',
}

export enum CacheLayerStoreLoaderType {
  DuckDB = 'DuckDB',
}

export interface ICacheLayerOptions {
  /** The provider which provides the content of our cache files. e.g. LocalFile provider to save built result in local disk. */
  provider?: CacheLayerProviderType | string;
  folderPath?: string;
  loader?: CacheLayerStoreLoaderType | string;
}

export const cacheProfileName = 'cache-layer';

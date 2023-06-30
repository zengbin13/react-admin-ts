import type { AxiosRequestConfig, RawAxiosRequestHeaders, AxiosHeaders } from 'axios';

export interface Result {
  code: string;
  msg: string;
}

export interface ResultData<T = any> extends Result {
  data?: T;
}

export interface CustomHeader {
  fullLoading?: boolean;
  [propName: string]: any;
}

export interface AxiosCustomRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers?: (RawAxiosRequestHeaders & CustomHeader) | AxiosHeaders;
}

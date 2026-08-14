import { InputHTMLAttributes } from "react";

export interface IInputField<T> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name"
> {
  name: keyof T;
  inputName: string;
}

export interface ILoginFormInput {
  email: string;
  password: string;
  duplicate: string;
}

export interface ILoginFormData {
  email: string;
  password: string;
  duplicate: string;
}

export interface ILoginResponse {
  access_token: string;
}

export interface IProfileFormInput {
  name: string;
  email: string;
  avatarLink: string;
  telegram: string;
  vk: string;
  gitHub: string;
  linkedin: string;
  mySite: string;
}

export interface IProfileFormData {
  name: string;
  email: string;
  avatarLink: string;
  telegram: string;
  vk: string;
  gitHub: string;
  linkedin: string;
  mySite: string;
}

export interface IProfileResponse {
  name: string;
  email: string;
  avatarLink: string;
  telegram: string;
  vk: string;
  gitHub: string;
  linkedin: string;
  mySite: string;
}

export interface IUser {
  name: string;
  email: string;
  avatarLink: string;
  telegram: string;
  vk: string;
  gitHub: string;
  linkedin: string;
  mySite: string;
}

export interface IFileResponse {
  filePath: string;
}

export interface ICategoryFormInput {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface ICategory {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface ICategoryResponse extends ICategory {
  _id: string;
}

export interface ICategoryCreateResponse {
  createCategory: ICategoryResponse;
}

export interface ITagFormInput {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface ITag {
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface ITagResponse extends ITag {
  _id: string;
}

export interface ITagCreateResponse {
  createTag: ITagResponse;
}

export interface IArticleFormInput {
  slug: string;
  title: string;
  h1: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface IArticle {
  slug: string;
  title: string;
  h1: string;
  description: string;
  category: string;
  tags?: string[];
  image: string;
  imageAlt: string;
  content: string;
  status?: "draft" | "published" | "archived";
}

export interface IArticleResponse extends IArticle {
  _id: string;
}

export interface IArticleCreateResponse {
  message: string;
}

export interface ILastArticleResponse {
  _id: string;
  slug: string;
  title: string;
  h1: string;
  description: string;
  category: ICategoryResponse;
  tags: ITagResponse[];
  image: string;
  imageAlt: string;
  readingTime: number;
  status: "draft" | "published" | "archived";
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IArticleListResponse {
  articles: ILastArticleResponse[];
  totalCount: number;
}

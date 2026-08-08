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

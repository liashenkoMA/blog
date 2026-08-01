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

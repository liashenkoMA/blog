import { IArticleFormInput, IInputField } from "@/_interfaces/interfaces";

export const ARTICLE_FORM_INPUTS: IInputField<IArticleFormInput>[] = [
  {
    name: "slug",
    inputName: "Slug:",
    placeholder: "Введите slug",
    type: "text",
    required: true,
  },
  {
    name: "title",
    inputName: "Title:",
    placeholder: "Введите title",
    type: "text",
    required: true,
  },
  {
    name: "h1",
    inputName: "H1:",
    placeholder: "Введите H1",
    type: "text",
    required: true,
  },
  {
    name: "description",
    inputName: "Description:",
    placeholder: "Введите description",
    type: "text",
    required: true,
  },
  {
    name: "image",
    inputName: "Изображение:",
    placeholder: "Введите URL изображения",
    type: "text",
    required: true,
  },
  {
    name: "imageAlt",
    inputName: "Alt изображения:",
    placeholder: "Введите описание изображения",
    type: "text",
    required: true,
  },
];

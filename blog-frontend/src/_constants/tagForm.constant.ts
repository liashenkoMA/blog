import { IInputField, ITagFormInput } from "@/_interfaces/interfaces";

export const TAG_FORM_INPUTS: IInputField<ITagFormInput>[] = [
  {
    name: "slug",
    inputName: "Slug:",
    placeholder: "Введите slug",
    type: "text",
    required: true,
  },
  {
    name: "name",
    inputName: "Название:",
    placeholder: "Введите название тега",
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
  {
    name: "title",
    inputName: "Title:",
    placeholder: "Введите title",
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
];

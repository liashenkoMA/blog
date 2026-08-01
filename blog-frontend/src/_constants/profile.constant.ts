import { IInputField, IProfileFormInput } from "@/_interfaces/interfaces";

export const PROFILE_FORM_INPUTS: IInputField<IProfileFormInput>[] = [
  {
    name: "name",
    inputName: "Изменить имя:",
    placeholder: "Иван",
    type: "text",
    minLength: 2,
    maxLength: 30,
  },
  {
    name: "email",
    inputName: "Изменить email:",
    placeholder: "ivan@mail.ru",
    type: "email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  },
  {
    name: "avatarLink",
    inputName: "Ссылка на аватар:",
    placeholder: "https://example.com/avatar.jpg",
    type: "url",
  },
  {
    name: "telegram",
    inputName: "Telegram:",
    placeholder: "https://t.me/username",
    type: "url",
  },
  {
    name: "vk",
    inputName: "VK:",
    placeholder: "https://vk.com/username",
    type: "url",
  },
  {
    name: "gitHub",
    inputName: "GitHub:",
    placeholder: "https://github.com/username",
    type: "url",
  },
  {
    name: "linkedin",
    inputName: "LinkedIn:",
    placeholder: "https://linkedin.com/in/username",
    type: "url",
  },
  {
    name: "mySite",
    inputName: "Мой сайт:",
    placeholder: "https://example.com",
    type: "url",
  },
];

"use client";

import styles from "./adminArticleForm.module.scss";
import { useState } from "react";
import MarkdownEditor from "../UI/MarkdownEditor/MarkdownEditor";
import Form from "../UI/Form/Form";
import Button from "../UI/Button/Button";
import { z } from "zod";
import { ARTICLE_FORM_INPUTS } from "@/_constants/articleForm.constant";
import Input from "../UI/Input/Input";
import { ICategoryResponse, ITagResponse } from "@/_interfaces/interfaces";
import { createArticle } from "@/_utils/client/articleApi";

const formSchema = z.object({
  slug: z.string().min(2, { message: "Slug должен быть не короче 2 символов" }),
  title: z
    .string()
    .min(2, { message: "Title должен быть не короче 2 символов" }),
  h1: z.string().min(2, { message: "H1 должен быть не короче 2 символов" }),
  description: z
    .string()
    .min(2, { message: "Description должна быть не короче 2 символов" }),
  category: z.string().min(1, { message: "Выберите категорию" }),
  tags: z.array(z.string()),
  image: z.url({
    message: "Введите корректную ссылку на изображение",
  }),
  imageAlt: z
    .string()
    .min(2, { message: "Alt должен быть не короче 2 символов" }),

  content: z.string().min(2, { message: "Статья не может быть пустой" }),
  status: z
    .union([z.literal("draft"), z.literal("published"), z.literal("archived")])
    .optional(),
});

type ArticleFormType = z.infer<typeof formSchema>;

const initialFormState: ArticleFormType = {
  slug: "",
  title: "",
  h1: "",
  description: "",
  category: "",
  tags: [],
  image: "",
  imageAlt: "",
  content: "",
  status: "draft",
};

export default function AdminArticleForm({
  categories,
  tags,
}: {
  categories: ICategoryResponse[];
  tags: ITagResponse[];
}) {
  const [formData, setFormData] = useState<ArticleFormType>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors(undefined);
  }

  function handleContentChange(content: string) {
    setFormData((prev) => ({
      ...prev,
      content,
    }));

    setErrors(undefined);
  }

  function handleTagChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      tags: checked
        ? [...prev.tags, value]
        : prev.tags.filter((id) => id !== value),
    }));
    setErrors(undefined);
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
    setErrors(undefined);
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const error = z.flattenError(validationResult.error);
      setErrors(error);
      return;
    }

    setIsLoading(true);

    createArticle(formData)
      .then(() => setServerErrorMessage(""))
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className={styles.adminArticleForm}>
      <Form handleSubmit={handleSubmit}>
        <div className={styles.adminArticleForm__metadata}>
          {ARTICLE_FORM_INPUTS.map((input) => (
            <Input
              key={input.name}
              {...input}
              onChange={handleChange}
              errors={errors?.fieldErrors?.[input.name]?.join(", ")}
              value={formData[input.name] ?? ""}
              inputName={input.name}
            />
          ))}
          <label className={styles.adminArticleForm__field}>
            <span className={styles.adminArticleForm__placeholder}>
              Категория
            </span>
            <select
              className={styles.adminArticleForm__lists}
              value={formData.category}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option
                  key={cat._id}
                  value={cat._id}
                  className={styles.adminArticleForm__list}
                >
                  {cat.name}
                </option>
              ))}
            </select>
            <span className={styles.adminArticleForm__errors}>
              {errors?.fieldErrors?.category?.join(", ")}
            </span>
          </label>
          <div className={styles.adminArticleForm__field}>
            <span className={styles.adminArticleForm__placeholder}>Тэги</span>

            <div className={styles.adminArticleForm__tags}>
              {tags.map((tag) => (
                <label key={tag._id} className={styles.adminArticleForm__tag}>
                  <input
                    type="checkbox"
                    value={tag._id}
                    checked={formData.tags?.includes(tag._id)}
                    onChange={handleTagChange}
                    className={styles.adminArticleForm__checkbox}
                  />
                  <span className={styles.adminArticleForm__text}>
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
            <span className={styles.adminArticleForm__errors}>
              {errors?.fieldErrors?.tags?.join(", ")}
            </span>
          </div>
        </div>
        <MarkdownEditor onChange={handleContentChange} />
        <span className={styles.adminArticleForm__errors}>
          {serverErrorMessage}
        </span>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "...loading" : "Создать статью"}
        </Button>
      </Form>
    </div>
  );
}

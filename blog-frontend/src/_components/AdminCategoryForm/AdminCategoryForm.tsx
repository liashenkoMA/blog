"use client";

import styles from "./adminCategoryForm.module.scss";
import Form from "../UI/Form/Form";
import { CATEGORY_FORM_INPUTS } from "@/_constants/category.constant";
import Input from "../UI/Input/Input";
import { z } from "zod";
import { useState } from "react";
import Button from "../UI/Button/Button";
import { createCategory } from "@/_utils/client/categoryApi";

const formSchema = z.object({
  slug: z.string().min(2, { message: "Slug должен быть не короче 2 символов" }),
  name: z
    .string()
    .min(2, { message: "Название должно быть не короче 2 символов" }),
  image: z.url({ message: "Введите корректную ссылку на изображение" }),
  imageAlt: z
    .string()
    .min(2, { message: "Alt должен быть не короче 2 символов" }),
  title: z
    .string()
    .min(2, { message: "Title должен быть не короче 2 символов" }),
  description: z
    .string()
    .min(2, { message: "Description должна быть не короче 2 символов" }),
});

type CategoryFormType = z.infer<typeof formSchema>;

const initialFormState: CategoryFormType = {
  slug: "",
  name: "",
  image: "",
  imageAlt: "",
  title: "",
  description: "",
};

export default function AdminCategoryForm() {
  const [formData, setFormData] = useState<CategoryFormType>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
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

    createCategory(formData)
      .then((res) => {
        console.log(res);
        setServerErrorMessage("");
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className={styles.adminCategoryForm}>
      <Form handleSubmit={handleSubmit}>
        {CATEGORY_FORM_INPUTS.map((input) => (
          <Input
            key={input.name}
            {...input}
            onChange={handleChange}
            errors={errors?.fieldErrors?.[input.name]?.join(", ")}
            value={formData[input.name] ?? ""}
            inputName={input.name}
          />
        ))}
        <Button type="submit" disabled={isLoading || Boolean(errors)}>
          Создать категорию
        </Button>
        <span className={styles.adminCategoryForm__errors}>
          {serverErrorMessage}
        </span>
      </Form>
    </div>
  );
}

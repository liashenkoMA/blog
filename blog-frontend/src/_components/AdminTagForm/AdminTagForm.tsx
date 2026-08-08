"use client";

import styles from "./adminTagForm.module.scss";
import Form from "../UI/Form/Form";
import Input from "../UI/Input/Input";
import { z } from "zod";
import { useState } from "react";
import Button from "../UI/Button/Button";
import { createTag } from "@/_utils/client/tagApi";
import { TAG_FORM_INPUTS } from "@/_constants/tagForm.constant";

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

type TagFormType = z.infer<typeof formSchema>;

const initialFormState: TagFormType = {
  slug: "",
  name: "",
  image: "",
  imageAlt: "",
  title: "",
  description: "",
};

export default function AdminTagForm() {
  const [formData, setFormData] = useState<TagFormType>(initialFormState);
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

    createTag(formData)
      .then(() => {
        setServerErrorMessage("");
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className={styles.adminTagForm}>
      <Form handleSubmit={handleSubmit}>
        {TAG_FORM_INPUTS.map((input) => (
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
          Создать тег
        </Button>
        <span className={styles.adminTagForm__errors}>
          {serverErrorMessage}
        </span>
      </Form>
    </div>
  );
}

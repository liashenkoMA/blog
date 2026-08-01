"use client";

import styles from "./adminProfileForm.module.scss";
import { PROFILE_FORM_INPUTS } from "@/_constants/profile.constant";
import Form from "../UI/Form/Form";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import { z } from "zod";
import React, { useState } from "react";
import { IUser } from "@/_interfaces/interfaces";
import { updateUser } from "@/_utils/client/userApi";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно быть не короче 2 символов" })
    .or(z.literal("")),
  email: z.email({ message: "Введите корректный email" }).or(z.literal("")),
  avatarLink: z.url({ message: "Введите корректную ссылку" }).or(z.literal("")),
  telegram: z.url({ message: "Введите корректную ссылку" }).or(z.literal("")),
  vk: z.url({ message: "Введите корректную ссылку" }).or(z.literal("")),
  gitHub: z.url({ message: "Введите корректную ссылку" }).or(z.literal("")),
  linkedin: z.url({ message: "Введите корректную ссылку" }).or(z.literal("")),
  mySite: z.url({ message: "Введите корректную ссылку" }).or(z.literal("")),
});

type ProfileFormType = z.infer<typeof formSchema>;

const initialFormState: ProfileFormType = {
  name: "",
  email: "",
  avatarLink: "",
  telegram: "",
  vk: "",
  gitHub: "",
  linkedin: "",
  mySite: "",
};

export default function AdminProfileForm({ user }: { user: IUser }) {
  const [formData, setFormData] = useState<ProfileFormType>({
    ...initialFormState,
    ...user,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] =
    useState<z.ZodFlattenedError<z.infer<typeof formSchema>>>();
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

    updateUser(formData)
      .then((res) => {
        setFormData({
          name: res.name,
          email: res.email,
          avatarLink: res.avatarLink,
          telegram: res.telegram,
          vk: res.vk,
          gitHub: res.gitHub,
          linkedin: res.linkedin,
          mySite: res.mySite,
        });
        setServerErrorMessage("");
      })
      .catch((err) => setServerErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className={styles.adminProfileForm}>
      <Form handleSubmit={handleSubmit}>
        {PROFILE_FORM_INPUTS.map((input) => (
          <Input
            key={input.name}
            {...input}
            onChange={handleChange}
            errors={errors?.fieldErrors?.[input.name]?.join(", ")}
            value={formData[input.name] ?? ""}
            inputName={input.inputName}
          />
        ))}
        <Button type="submit" disabled={isLoading || Boolean(errors)}>
          {isLoading ? "Сохраняем изменения..." : "Изменить профиль"}
        </Button>
        <span className={styles.adminProfileForm__errors}>
          {serverErrorMessage}
        </span>
      </Form>
    </div>
  );
}

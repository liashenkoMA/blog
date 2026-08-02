"use client";

import styles from "./adminGalleryForm.module.scss";
import Button from "../UI/Button/Button";
import Form from "../UI/Form/Form";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { postFile } from "../../_utils/client/fileApi";
import Image from "next/image";

export default function AdminGalleryForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileImage, setFileImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const FILE_SIGNATURES = {
    jpeg: [0xff, 0xd8, 0xff],
    png: [0x89, 0x50, 0x4e, 0x47],
    webp: {
      riff: [0x52, 0x49, 0x46, 0x46],
      webp: [0x57, 0x45, 0x42, 0x50],
    },
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const acceptFile = acceptedFiles[0];

    if (!acceptFile) return;

    const previewUrl = URL.createObjectURL(acceptFile);

    setFile(acceptFile);
    setPreview(previewUrl);
    setFileImage("");
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false,
    disabled: isLoading,
    noClick: true,
  });

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleRemoveFile() {
    setFile(null);
    setPreview("");
    setFileImage("");
    setError("");
  }

  async function checkFileSignature(file: File) {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const view = new Uint8Array(buffer);

    const matches = (signature: number[], offset = 0) =>
      signature.every((byte, index) => view[offset + index] === byte);

    if (file.type === "image/jpeg") {
      if (!matches(FILE_SIGNATURES.jpeg)) {
        throw new Error("Файл не является JPEG.");
      }
    } else if (file.type === "image/png") {
      if (!matches(FILE_SIGNATURES.png)) {
        throw new Error("Файл не является PNG.");
      }
    } else if (file.type === "image/webp") {
      if (
        !matches(FILE_SIGNATURES.webp.riff) ||
        !matches(FILE_SIGNATURES.webp.webp, 8)
      ) {
        throw new Error("Файл не является WebP.");
      }
    } else {
      throw new Error("Неподдерживаемый формат изображения.");
    }
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!file) return;

    setIsLoading(true);

    try {
      await checkFileSignature(file);

      const res = await postFile(file);

      setFileImage(res.filePath);
      setIsLoading(false);
      setPreview("");
      setFile(null);
      setError("");
    } catch (err) {
      setIsLoading(false);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ошибка загрузки файла");
      }
    }
  }

  return (
    <div className={styles.adminGalleryForm}>
      <Form handleSubmit={handleSubmit}>
        {preview ? (
          <div className={styles.adminGalleryForm__preview}>
            <Image
              src={preview}
              width={300}
              height={200}
              className={styles.adminGalleryForm__preview_image}
              alt="Превью картинки"
            />
            <div className={styles.adminGalleryForm__preview_info}>
              <p className={styles.adminGalleryForm__preview_text}>
                Выбран файл:
              </p>
              <p
                className={`${styles.adminGalleryForm__preview_url} ${styles.adminGalleryForm__preview_text}`}
              >
                {file?.name}
              </p>
            </div>
            <Button type="button" variant="danger" onClick={handleRemoveFile}>
              Удалить
            </Button>
          </div>
        ) : (
          <label
            className={`${styles.adminGalleryForm__form_field} ${isLoading ? styles.adminGalleryForm__form_field_loading : ""}`}
            {...getRootProps()}
          >
            <input
              type="file"
              name="file"
              className={styles.adminGalleryForm__input}
              {...getInputProps()}
              aria-label="Выберите изображение"
            />
            <span className={styles.adminGalleryForm__text}>
              {isDragActive
                ? "Отпустите файл для загрузки"
                : "Выберите файл или перетащите его сюда"}
            </span>
          </label>
        )}
        <span className={styles.adminGalleryForm__errors}>{error}</span>
        <Button type="submit" disabled={isLoading}>
          Загрузить картинку
        </Button>
      </Form>
      <div className={styles.adminGalleryForm__result}>
        <p className={styles.adminGalleryForm__result_text}>URL картинки:</p>
        <p
          className={`${styles.adminGalleryForm__result_url} ${styles.adminGalleryForm__result_text}`}
        >
          {fileImage}
        </p>
      </div>
    </div>
  );
}

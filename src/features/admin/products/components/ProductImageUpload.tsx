"use client";

import { useEffect, useId, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Props = {
  value: string;
  onChange: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  error?: string;
  disabled?: boolean;
};

export default function ProductImageUpload({
  value,
  onChange,
  onUploadingChange,
  error,
  disabled = false,
}: Props) {
  const t = useTranslations("admin");
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Release the object URL when the preview changes or the field unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const setUploading = (next: boolean) => {
    setIsUploading(next);
    onUploadingChange?.(next);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Allow choosing the same file again after a failed upload.
    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.add({ type: "error", title: t("imageInvalidType") });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.add({ type: "error", title: t("imageTooLarge") });
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/products/upload", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as
        | ApiSuccessResponse<{ url: string }>
        | ApiErrorResponse;

      if (!response.ok || "error" in payload) {
        onChange("");
        setPreviewUrl(null);
        toast.add({ type: "error", title: t("imageUploadFailed") });
        return;
      }

      onChange(payload.data.url);
    } catch {
      onChange("");
      setPreviewUrl(null);
      toast.add({ type: "error", title: t("imageUploadFailed") });
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = previewUrl ?? (value || null);

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={inputId}>{t("image")}</FieldLabel>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt=""
              fill
              sizes="96px"
              unoptimized={Boolean(previewUrl)}
              className="object-cover"
            />
          ) : (
            <ImageIcon
              aria-hidden="true"
              className="size-6 text-muted-foreground"
            />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Input
            id={inputId}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="cursor-pointer file:me-2 file:cursor-pointer"
            disabled={disabled || isUploading}
            aria-invalid={Boolean(error)}
            onChange={handleImageChange}
          />
          <FieldDescription>
            {isUploading ? t("uploading") : t("imageHint")}
          </FieldDescription>
        </div>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

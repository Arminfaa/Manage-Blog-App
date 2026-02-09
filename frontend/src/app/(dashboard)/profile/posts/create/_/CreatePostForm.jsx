"use client";
import { useCategories } from "@/hooks/useCategories";
import Button from "@/ui/Button";
import ButtonIcon from "@/ui/ButtonIcon";
import FileInput from "@/ui/FileInput";
import RHFSelect from "@/ui/RHFSelect";
import RHFTextField from "@/ui/RHFTextField";
import RHFRichTextEditor from "@/ui/RHFRichTextEditor";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import useCreatePost from "./useCreatePost";
import SpinnerMini from "@/ui/SpinnerMini";
import { useRouter } from "next/navigation";
import useEditPost from "./useEditPost";
import { imageUrlToFile } from "@/utils/fileFormatter";

const schema = yup
  .object({
    title: yup
      .string()
      .min(5, "حداقل ۵ کاراکتر را وارد کنید")
      .required("عنوان ضروری است"),
    briefText: yup
      .string()
      .min(5, "حداقل ۱۰ کاراکتر را وارد کنید")
      .required("توضیحات ضروری است"),
    text: yup
      .string()
      .min(5, "حداقل ۱۰ کاراکتر را وارد کنید")
      .required("توضیحات ضروری است"),
    slug: yup.string().required("اسلاگ ضروری است"),
    readingTime: yup
      .number()
      .positive()
      .integer()
      .required("زمان مطالعه ضروری است")
      .typeError("یک عدد را وارد کنید"),
    category: yup.string().required("دسته بندی ضروری است"),
  })
  .required();

function CreatePostForm({ postToEdit = {} }) {
  const { _id: editId } = postToEdit;
  const isEditSession = Boolean(editId);
  const {
    title,
    text,
    slug,
    briefText,
    readingTime,
    category,
    coverImage,
    coverImageUrl: prevCoverImageUrl,
  } = postToEdit;
  let editValues = {};
  if (isEditSession) {
    editValues = {
      title,
      text,
      slug,
      briefText,
      readingTime,
      category: category._id,
      coverImage, // https://floan.ir/upload/folan.png => File !!!
    };
  }

  const { categories } = useCategories();
  const [coverImageUrl, setCoverImageUrl] = useState(prevCoverImageUrl || null);
  const { createPost, isCreating } = useCreatePost();
  const { editPost, isEditing } = useEditPost();
  const router = useRouter();

  const {
    control,
    reset,
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(schema),
    defaultValues: editValues,
  });

  // Converting prev IMAGE URL to IMAGE FILE to update useForm converImage !
  useEffect(() => {
    if (prevCoverImageUrl) {
      // convert preve link to file
      async function fetchMyApi() {
        const file = await imageUrlToFile(prevCoverImageUrl);
        setValue("coverImage", file);
      }
      fetchMyApi();
    }
  }, [editId, prevCoverImageUrl, setValue]);

  const onSubmit = (data) => {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (isEditSession) {
      editPost(
        { id: editId, data: formData },
        {
          onSuccess: () => {
            reset();
            router.push("/profile/posts");
          },
        }
      );
    } else {
      createPost(formData, {
        onSuccess: () => {
          router.push("/profile/posts");
        },
      });
    }
  };

  return (
    <form className="form !max-w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <RHFTextField
          name="title"
          label="عنوان"
          errors={errors}
          register={register}
          isRequired
        />
        <RHFTextField
          name="briefText"
          label="متن کوتاه"
          errors={errors}
          register={register}
          isRequired
        />
      </div>
      <Controller
        name="text"
        control={control}
        rules={{ required: "متن پست ضروری است", minLength: { value: 5, message: "حداقل ۱۰ کاراکتر را وارد کنید" } }}
        render={({ field: { value, onChange } }) => (
          <RHFRichTextEditor
            name="text"
            label="متن پست"
            value={value}
            onChange={onChange}
            errors={errors}
            isRequired
            placeholder="متن پست را با فرمت‌های لیست، بولد، سایز فونت و... بنویسید"
          />
        )}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <RHFTextField
          name="slug"
          label="اسلاگ"
          errors={errors}
          register={register}
          isRequired
        />
        <RHFTextField
          name="readingTime"
          label="زمان مطالعه"
          errors={errors}
          register={register}
          isRequired
        />
        <RHFSelect
          name="category"
          label="دسته بندی"
          errors={errors}
          register={register}
          isRequired
          options={categories}
        />
      </div>
      <div className="space-y-3">
        <Controller
          name="coverImage"
          control={control}
          rules={{ required: "کاور پست الزامی است" }}
          render={({ field: { value, onChange, ...rest } }) => {
            return (
              <FileInput
                label="انتخاب کاور پست"
                name="coverImage"
                isRequired
                errors={errors}
                className="inline-flex text-sm px-3 py-1.5 rounded-md border-2 md:w-fit w-full"
                {...rest}
                value={value?.fileName}
                onChange={(event) => {
                  const file = event.target.files[0];
                  onChange(file);
                  setCoverImageUrl(URL.createObjectURL(file));
                  event.target.value = null;
                }}
              />
            );
          }}
        />

        {coverImageUrl ? (
          <div className="relative w-full md:max-w-sm aspect-video overflow-hidden rounded-lg border border-secondary-200">
            <Image
              fill
              alt="cover-image"
              src={coverImageUrl}
              className="object-cover object-center"
            />
            <ButtonIcon
              onClick={() => {
                setCoverImageUrl(null);
                setValue("coverImage", null);
              }}
              variant="red"
              className="w-5 h-5 absolute left-2 top-2"
            >
              <XMarkIcon />
            </ButtonIcon>
          </div>
        ) : (
          <div className="w-full md:max-w-sm aspect-video overflow-hidden rounded-lg border border-secondary-200 bg-secondary-50 flex items-center justify-center">
            <p className="text-secondary-400 text-sm">کاور پست را انتخاب کنید</p>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:ms-auto">
        <Link href="/profile/posts" className="w-full md:w-auto md:flex-initial">
          <Button type="button" variant="outline" className="w-full px-4 py-2">
            انصراف
          </Button>
        </Link>
        {isCreating || isEditing ? (
          <SpinnerMini />
        ) : (
          <Button
            variant="primary"
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 md:min-w-[250px]"
          >
            تایید
          </Button>
        )}
      </div>
    </form>
  );
}
export default CreatePostForm;

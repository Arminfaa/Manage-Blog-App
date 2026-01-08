"use client";
import Button from "@/ui/Button";
import RHFTextField from "@/ui/RHFTextField";
import RHFTextArea from "@/ui/RHFTextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import useCreateCategory from "./useCreateCategory";
import useUpdateCategory from "./useUpdateCategory";
import SpinnerMini from "@/ui/SpinnerMini";

const schema = yup
    .object({
        title: yup
            .string()
            .min(3, "حداقل ۳ کاراکتر را وارد کنید")
            .max(100, "حداکثر ۱۰۰ کاراکتر")
            .required("عنوان فارسی ضروری است"),
        englishTitle: yup
            .string()
            .min(3, "حداقل ۳ کاراکتر را وارد کنید")
            .max(100, "حداکثر ۱۰۰ کاراکتر")
            .required("عنوان انگلیسی ضروری است"),
        description: yup
            .string()
            .min(3, "حداقل ۳ کاراکتر را وارد کنید")
            .max(200, "حداکثر ۲۰۰ کاراکتر")
            .required("توضیحات ضروری است"),
    })
    .required();

function CreateCategoryForm({ categoryToEdit = {} }) {
    const { _id: editId } = categoryToEdit;
    const isEditSession = Boolean(editId);
    const { title, englishTitle, description } = categoryToEdit;

    let editValues = {};
    if (isEditSession) {
        editValues = {
            title,
            englishTitle,
            description,
        };
    }

    const { createCategory, isCreating } = useCreateCategory();
    const { updateCategory, isUpdating } = useUpdateCategory();
    const router = useRouter();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(schema),
        defaultValues: editValues,
    });

    const onSubmit = async (values) => {
        if (isEditSession) {
            updateCategory(
                { id: editId, data: values },
                {
                    onSuccess: () => {
                        router.push("/profile/categories");
                    },
                }
            );
        } else {
            createCategory(values, {
                onSuccess: () => {
                    router.push("/profile/categories");
                },
            });
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <div className="max-w-2xl">
            <h1 className="text-xl font-bold text-secondary-500 mb-6">
                {isEditSession ? "ویرایش دسته بندی" : "ایجاد دسته بندی جدید"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <RHFTextField
                    label="عنوان فارسی"
                    name="title"
                    register={register}
                    isRequired
                    errors={errors}
                />
                <RHFTextField
                    label="عنوان انگلیسی"
                    name="englishTitle"
                    register={register}
                    dir="ltr"
                    isRequired
                    errors={errors}
                />
                <RHFTextArea
                    label="توضیحات"
                    name="description"
                    register={register}
                    isRequired
                    errors={errors}
                />
                <div className="flex gap-x-4">
                    {isLoading ? (
                        <SpinnerMini />
                    ) : (
                        <Button type="submit" variant="primary">
                            {isEditSession ? "ویرایش" : "ایجاد"}
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        انصراف
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateCategoryForm;


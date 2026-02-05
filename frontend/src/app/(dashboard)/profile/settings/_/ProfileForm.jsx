"use client";
import Button from "@/ui/Button";
import RHFTextField from "@/ui/RHFTextField";
import RHFTextArea from "@/ui/RHFTextArea";
import FileInput from "@/ui/FileInput";
import Avatar from "@/ui/Avatar";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import useUpdateProfile from "./useUpdateProfile";
import useUploadAvatar from "./useUploadAvatar";
import useChangePassword from "./useChangePassword";
import SpinnerMini from "@/ui/SpinnerMini";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const schema = yup
    .object({
        name: yup
            .string()
            .min(5, "حداقل ۵ کاراکتر را وارد کنید")
            .max(50, "حداکثر ۵۰ کاراکتر")
            .required("نام ضروری است"),
        email: yup
            .string()
            .email("ایمیل نامعتبر است")
            .required("ایمیل ضروری است"),
        biography: yup
            .string()
            .max(30, "حداکثر ۳۰ کاراکتر")
            .nullable(),
    })
    .required();

const passwordSchema = yup
    .object({
        currentPassword: yup.string().required("رمز عبور فعلی الزامی است"),
        newPassword: yup
            .string()
            .min(8, "رمز عبور جدید حداقل ۸ کاراکتر باشد")
            .required("رمز عبور جدید الزامی است"),
        confirmNewPassword: yup
            .string()
            .oneOf([yup.ref("newPassword")], "رمز عبور جدید با تکرار آن یکسان نیست")
            .required("تکرار رمز عبور جدید الزامی است"),
    })
    .required();

function ProfileForm({ user }) {
    const { name, email, biography, avatarUrl: prevAvatarUrl } = user || {};
    const [avatarUrl, setAvatarUrl] = useState(prevAvatarUrl || null);
    const { updateUser } = useAuth();
    const router = useRouter();

    const { updateProfile, isUpdating } = useUpdateProfile();
    const { uploadAvatar, isUploading } = useUploadAvatar();
    const { changePassword, isChanging } = useChangePassword();

    const {
        register,
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(schema),
        defaultValues: {
            name: name || "",
            email: email || "",
            biography: biography || "",
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm({
        mode: "onTouched",
        resolver: yupResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    useEffect(() => {
        if (prevAvatarUrl) {
            setAvatarUrl(prevAvatarUrl);
        }
    }, [prevAvatarUrl]);

    const refreshUserAndPage = () => {
        updateUser().then(() => router.refresh());
    };

    const onSubmit = async (data) => {
        // Upload avatar first if selected
        if (data.avatar) {
            const formData = new FormData();
            formData.append("avatar", data.avatar);
            uploadAvatar(formData, {
                onSuccess: () => {
                    // Then update profile info
                    updateProfile(
                        {
                            name: data.name,
                            email: data.email,
                            biography: data.biography || "",
                        },
                        {
                            onSuccess: refreshUserAndPage,
                        }
                    );
                },
            });
        } else {
            // Update profile info only
            updateProfile(
                {
                    name: data.name,
                    email: data.email,
                    biography: data.biography || "",
                },
                {
                    onSuccess: refreshUserAndPage,
                }
            );
        }
    };

    const onPasswordSubmit = (data) => {
        changePassword(
            { currentPassword: data.currentPassword, newPassword: data.newPassword },
            {
                onSuccess: () => resetPasswordForm(),
            }
        );
    };

    const isLoading = isUpdating || isUploading;

    return (
        <div className="max-w-2xl">
            <h1 className="text-xl font-bold text-secondary-500 mb-6">
                ویرایش پروفایل
            </h1>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 mb-6">
                    <Avatar
                        src={avatarUrl}
                        alt={name || "User"}
                        width={120}
                        height={120}
                        className="border-4 border-primary-200"
                    />
                    <Controller
                        name="avatar"
                        control={control}
                        defaultValue={null}
                        render={({ field: { onChange, ...rest } }) => (
                            <FileInput
                                label="تغییر عکس پروفایل"
                                name="avatar"
                                errors={errors}
                                {...rest}
                                onChange={(event) => {
                                    const file = event.target.files[0];
                                    if (file) {
                                        onChange(file);
                                        setAvatarUrl(URL.createObjectURL(file));
                                        event.target.value = "";
                                    }
                                }}
                            />
                        )}
                    />
                </div>

                <RHFTextField
                    label="نام و نام خانوادگی"
                    name="name"
                    register={register}
                    isRequired
                    errors={errors}
                />
                <RHFTextField
                    label="ایمیل"
                    name="email"
                    register={register}
                    dir="ltr"
                    isRequired
                    errors={errors}
                />
                <RHFTextArea
                    label="بیوگرافی"
                    name="biography"
                    register={register}
                    errors={errors}
                />

                <div className="flex gap-x-4">
                    {isLoading ? (
                        <SpinnerMini />
                    ) : (
                        <Button type="submit" variant="primary">
                            ذخیره تغییرات
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

            {/* تغییر رمز عبور */}
            <div className="mt-10 pt-8 border-t border-secondary-200">
                <h2 className="text-lg font-bold text-secondary-500 mb-4">
                    تغییر رمز عبور
                </h2>
                <form
                    className="form"
                    onSubmit={handleSubmitPassword(onPasswordSubmit)}
                >
                    <RHFTextField
                        label="رمز عبور فعلی"
                        name="currentPassword"
                        type="password"
                        register={registerPassword}
                        dir="ltr"
                        isRequired
                        errors={passwordErrors}
                    />
                    <RHFTextField
                        label="رمز عبور جدید"
                        name="newPassword"
                        type="password"
                        register={registerPassword}
                        dir="ltr"
                        isRequired
                        errors={passwordErrors}
                    />
                    <RHFTextField
                        label="تکرار رمز عبور جدید"
                        name="confirmNewPassword"
                        type="password"
                        register={registerPassword}
                        dir="ltr"
                        isRequired
                        errors={passwordErrors}
                    />
                    {isChanging ? (
                        <SpinnerMini />
                    ) : (
                        <Button type="submit" variant="primary">
                            تغییر رمز عبور
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ProfileForm;


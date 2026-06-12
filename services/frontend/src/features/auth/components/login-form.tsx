"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { loginAction } from "../actions";
import { loginSchema, type LoginFormValues } from "../schemas";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await loginAction(values);
    if (result.error) setError("root", { message: result.error });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Username" error={errors.username?.message}>
        <input
          {...register("username")}
          type="text"
          placeholder="yourname"
          autoComplete="username"
          spellCheck={false}
          className={inputClass(!!errors.username)}
        />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          className={inputClass(!!errors.password)}
        />
      </Field>

      {errors.root && <p className="text-[12.5px] text-red-400 -mb-1">{errors.root.message}</p>}

      <Button size="lg" type="submit" loading={isSubmitting} className="mt-1.5">
        {isSubmitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}

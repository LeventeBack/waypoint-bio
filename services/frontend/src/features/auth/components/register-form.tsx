"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/ui/field";
import { Icon } from "@/components/ui/icons";
import { PUBLIC_HOST } from "@/lib/constants";
import { registerAction } from "../actions";
import { PASSWORD_MIN_LENGTH } from "../constants";
import { registerSchema, type RegisterFormValues } from "../schemas";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await registerAction(values);
    if (result.error) setError("root", { message: result.error });
  });

  const username = useWatch({ control, name: "username" });
  const usernameOk = registerSchema.shape.username.safeParse(username).success;
  const usernameField = register("username");

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field
        label="Username"
        error={errors.username?.message}
        hint={
          usernameOk
            ? `Your page will live at ${PUBLIC_HOST}/${username}`
            : "This becomes your public URL."
        }
      >
        <div className={`flex items-center ${inputClass(!!errors.username)} px-0 overflow-hidden`}>
          <span className="pl-3.5 pr-0.5 font-mono text-[13px] text-faint select-none whitespace-nowrap">
            {PUBLIC_HOST}/
          </span>
          <input
            {...usernameField}
            type="text"
            placeholder="yourname"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              e.target.value = e.target.value.toLowerCase().replace(/\s/g, "");
              return usernameField.onChange(e);
            }}
            className="flex-1 h-full bg-transparent font-mono text-[13.5px] text-ink placeholder:text-faint focus:outline-none pr-3"
          />
          {usernameOk && (
            <span className="pr-3 text-emerald-400">
              <Icon name="check" size={15} />
            </span>
          )}
        </div>
      </Field>

      <Field
        label="Password"
        error={errors.password?.message}
        hint={`At least ${PASSWORD_MIN_LENGTH} characters.`}
      >
        <input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          className={inputClass(!!errors.password)}
        />
      </Field>

      {errors.root && <p className="text-[12.5px] text-red-400 -mb-1">{errors.root.message}</p>}

      <Button size="lg" type="submit" loading={isSubmitting} className="mt-1.5">
        {isSubmitting ? "Creating your page…" : "Create my page"}
      </Button>
    </form>
  );
}

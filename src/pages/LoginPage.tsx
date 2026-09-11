import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Loginschema, type LoginFormValues } from "../schemas/Loginschema";
import { Header } from "../components/shared/Header";
import { AuthCard } from "../components/shared/AuthCard";
import { PasswordField } from "../components/shared/PasswordField";
import { FormField } from "../components/shared/FormField";
import { Button } from "../components/shared/Button";
import { FooterLink } from "../components/shared/FooterLink";
import { useState } from "react";
import { Login as loginUser } from "../services/AuthService";
import  Loginheader from"../components/login-com/Loginheader";
import {RememberMeSection} from "../components/login-com/Remeberme";
import { Savesession } from "../store/Authstore";
const LoginPage = () => {
  const navigate = useNavigate();
  const [servererror, setservereeror] = useState<string | null>(null);
const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(Loginschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setservereeror(null);
    try {
       const result=await loginUser({
        email: values.email,
        password: values.password,
      });
    Savesession(
      {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        expires_at: result.expires_at,
      },
      rememberMe
    );

      
      navigate("/project");
    } catch (err) {
      if (err instanceof Error) {
        setservereeror(err.message);
      }
    }
  };

  return (
    <>
    <Header/>
                 <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center  bg-white md:bg-background px-6 py-12">

      <AuthCard>
        <div>
          <Loginheader/>
        </div>
        <form className="flex flex-col gap-6 "  onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="yourname@company.com"
                value={field.value}
                onChange={field.onChange}
                error={errors.email?.message}
              />
            )}
          />
          

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <PasswordField
                label="Password"
                name="password"
                placeholder="Enter your password"
                value={field.value}
                onChange={field.onChange}
                error={errors.password?.message}
                  linkText="Forgot?"
  onLinkClick={() => navigate("/forgot-password")}
              />
            )}
          />
          <RememberMeSection
  checked={rememberMe}
  onCheckedChange={setRememberMe}
  onForgotPassword={() => navigate("/forgot-password")}
/>

          {servererror && (
            <p className="text-label-sm text-error">{servererror}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>
<div className=" mt-8">
        <FooterLink
          text="Don't have an account? "
          linkText="Sign Up"
          onLinkClick={() => navigate("/sign-up")}
        />
        </div>
      </AuthCard>
      </div>
    </>
  );
};

export default LoginPage;
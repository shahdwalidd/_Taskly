import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "../components/shared/LogoIcon";
import { Heading } from "../components/register-com/Heading";
import { PasswordField } from "../components/shared/PasswordField";
import { FormField } from "../components/shared/FormField";
import { AuthCard } from "./AuthCard";
import { Button } from "../components/shared/Button";
import { FooterLink } from "../components/shared/FooterLink";
import { PasswordRequirements } from "../components/register-com/PasswordRequirements";
import { signupSchema,type SignupFormValues } from "../schemas/Signupschema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/AuthService";
export function SignUp() {
    const navigate=useNavigate();
    const [servererroe,setservereeror]=useState<string|null>(null);

    const {control,handleSubmit,watch,formState:{ errors, isSubmitting},}=useForm<SignupFormValues>({resolver:zodResolver(signupSchema),defaultValues:{  name: "",
        email: "",
        jobTitle: "",
        password: "",
        confirmPassword: "",}})
   
// eslint-disable-next-line react-hooks/incompatible-library
const  passwordValue=watch("password");
const onSubmit= async(formvalues:SignupFormValues)=>{
   setservereeror(null);
   try{
    await signUp({ email:formvalues.email,
    password:formvalues.password,
    data: {
      name:formvalues.name,
      department:formvalues.jobTitle||undefined}})
       navigate("/login");
   }
   catch(error ){
if(error instanceof Error){
    setservereeror(error.message)
}
   }
}
  
    return (
                <><div className="flex w-full  pb-6">
  <Logo/>
        </div>
            <div className="flex flex-col ">
        <AuthCard>
          
            <div className="mt-8 mb-10 w-full">
                <Heading />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
                <Controller control={control}    name="name" render={({field})=>(  <FormField
                    label="Name"
                    name="name"
                    placeholder="Enter your full name"
                    hint="3-50 characters, letters only."
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.name?.message}
                />)}
/>
              
<Controller control={control}    name="email" render={({field})=>(<FormField
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="yourname@company.com"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.email?.message}
                />)}
/>
                
<Controller control={control}                     name="jobTitle" render={({field})=>(  <FormField
                    label="Job Title (Optional)"
                    name="jobTitle"
                    placeholder="e.g. Project Manager"
                    value={field.value??""}
                    onChange={field.onChange}
                    error={errors.jobTitle?.message}
                />)}
/>
              

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller control={control}                         name="password" render={({field})=>( <PasswordField
                        label="Password"
                        name="password"
                        placeholder="Password"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.password?.message}
                    />)}

                   />
                   <Controller control={control}                         name="confirmPassword"
render={({field})=>(<PasswordField
                        label="Confirm Password"
                        name="confirmPassword"
                        placeholder="Repeat your password"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.confirmPassword?.message}
                    />)}
                   />
                    
                </div>

                <PasswordRequirements password={passwordValue} />
                {servererroe && (
  <p className="text-label-sm text-error">{servererroe}</p>
)}

                <Button  type="submit" disabled={isSubmitting}>  {isSubmitting ? "Creating account..." : "Create Account"}
</Button>
            </form>

            <div className="mt-8">
                <FooterLink text="Already have an account?" linkText="Log in"  onLinkClick={()=> navigate("/login")}/>
            </div>
        </AuthCard>
        </div>
        </>
    );
}



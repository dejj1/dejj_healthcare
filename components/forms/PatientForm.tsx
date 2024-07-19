"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { checkEmailExists, createUser, getUserByEmail } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}
 

 
export const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true);

    try {

      const emailExists = await checkEmailExists(email);
      if (emailExists){
        const existingUser = await getUserByEmail(email)
        // If the email exists, redirect to the new appointment page
        if(existingUser){
          router.push(`/patients/${existingUser.$id}/new-appointment`);
          return;
        }
      }

      // if email doesn't exist, create the user
      const userData = { name, email, phone };
      const newUser = await createUser(userData);
      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
    }
  

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  }
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule your first appointment</p>
        </section>

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label=" Full name"
            placeholder="Deji Oyelakin"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            />
       
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label=" Email"
            placeholder="example@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            />
       
        <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label=" Phone Number"
            placeholder="(234) 123-4567"
           
            />
       
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}


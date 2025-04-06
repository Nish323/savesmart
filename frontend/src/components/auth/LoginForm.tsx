"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/utils/contexts/AuthContext";
import { ErrorType } from "@/types/errors/common";

const formSchema = z.object({
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  password: z.string().min(8, {
    message: "パスワードは8文字以上である必要があります。",
  }),
});

type LoginFormProps = {
  onSignUpClick: () => void;
};

export function LoginForm({ onSignUpClick }: LoginFormProps) {
  const { isLoading, login } = useAuth();
  const [errors, setErrors] = useState<ErrorType>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrors({});

    try {
      await login(values.email, values.password);
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        form.setError("email", { 
          message: "メールアドレスまたはパスワードが間違っています。" 
        });
        form.setError("password", { 
          message: "メールアドレスまたはパスワードが間違っています。" 
        });
      } else if (error.response && error.response.status === 422) {
        // バリデーションエラー
        setErrors(error.response.data.errors);
        
        // Set form errors
        if (error.response.data.errors.email) {
          form.setError("email", { 
            message: error.response.data.errors.email[0] 
          });
        }
        if (error.response.data.errors.password) {
          form.setError("password", { 
            message: error.response.data.errors.password[0] 
          });
        }
      } else {
        alert('ログイン中にエラーが発生しました。もう一度お試しください。');
      }
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
          <LogIn className="h-5 w-5" />
          ログイン
        </h2>
        <p className="text-sm text-gray-600">
          SaveSmartアカウントにログインして、資産管理を始めましょう。
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メールアドレス</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input className="pl-10" placeholder="your@email.com" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>パスワード</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input className="pl-10" type="password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                ログイン中...
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                ログイン
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-500">
          アカウントをお持ちでない方は
          <button
            onClick={onSignUpClick}
            className="text-primary hover:underline ml-1"
          >
            新規登録
          </button>
        </p>
        <button className="text-sm text-gray-500 hover:underline">
          パスワードをお忘れの方
        </button>
      </div>
    </div>
  );
}

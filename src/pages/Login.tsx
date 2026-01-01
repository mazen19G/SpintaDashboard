import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/icon.svg";
import nlogo from "@/assets/nlogo.png";
import slogan from "@/assets/slogan.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { loginUser } from "@/lib/authApi";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data.email, data.password);
      const { token, user } = response;

      // Store token and user data
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(`Welcome, ${user.full_name}!`);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content - Login Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-40 md:h-64 object-contain"
            />
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12">
            <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
              Login
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="text-base font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="mt-2"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="text-base font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className="mt-2"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
                
                {/* Forgot Password Link */}
                <div className="mt-2 text-right">
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Login Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-button text-lg font-semibold py-6"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </div>

          {/* Additional Logos Below Login Box */}
          <div className="mt-8 space-y-6">
            <div className="flex justify-center">
              <img 
                src={nlogo} 
                alt="NLogo" 
                className="h-20 object-contain"
              />
            </div>
            <div className="flex justify-center">
              <img 
                src={slogan} 
                alt="Slogan" 
                className="h-4 object-contain"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;

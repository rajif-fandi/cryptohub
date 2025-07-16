// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to CryptoHub!",
        });
        navigate("/");
      } else {
        // Pesan error ini sekarang berasal dari AuthContext (jika kredensial demo salah)
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try demo@example.com / password", // Tambahkan hint ini lagi
          variant: "destructive",
        });
      }
    } catch (error) { // Tangkap error jika AuthContext memutuskan untuk melempar error
      console.error("Login submission error:", error);
      toast({
        title: "Error",
        description: "Something went wrong during login simulation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-crypto-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-accent-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">₿</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-crypto-accent-blue to-crypto-accent-purple bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your CryptoHub account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@example.com" // Ubah kembali placeholder
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-crypto-accent-blue"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-crypto-accent-blue"
                  required
                />
              </div>
            </div>
            {/* Tambahkan kembali hint demo credentials */}
            <div className="text-sm text-slate-400">
              Demo credentials: demo@example.com / password
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-crypto-accent-blue to-crypto-accent-purple hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="text-center space-y-2">
              <Link to="/forgot-password" className="text-sm text-crypto-accent-blue hover:underline">
                Forgot your password?
              </Link>
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-crypto-accent-blue hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
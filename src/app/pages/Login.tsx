import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import bocraLogo from "../../bocra-logo.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { setAuthUser } from "../utils/auth";
import Captcha from "../components/CAPTCHA";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !department) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isCaptchaVerified) {
      toast.error("Please complete the security verification");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        // Store user info with department
        setAuthUser(
          {
            email: email,
            name: email
              .split("@")[0]
              .replace(".", " ")
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(" "),
            department: department,
            role: "Admin",
          },
          "mock-jwt-token"
        );

        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
       <div className="text-center mb-8">
                 <img
                    src={bocraLogo}
                    alt="BOCRA Logo"
                    className="mx-auto mb-6 h-32 w-auto"
                  />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">BOCRA Admin Portal</h1>
          <p className="text-gray-600">Botswana Communications Regulatory Authority</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@bocra.org.bw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                Department
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complaints">Complaints</SelectItem>
                  <SelectItem value="licensing">Licensing</SelectItem>
                  <SelectItem value="enforcement">Enforcement</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CAPTCHA */}
            <Captcha onVerify={setIsCaptchaVerified} />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11"
              disabled={isLoading || !isCaptchaVerified}
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
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Register here
              </Link>
            </p>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Admin Access Only:</strong> This portal is restricted to authorized BOCRA personnel.
              For demo purposes, use any email, password, and select a department to login.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2026 Botswana Communications Regulatory Authority</p>
          <p className="mt-1">All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
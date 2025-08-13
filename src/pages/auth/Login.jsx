import { login } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [errors, setErrors] = useState({});
    const [seePassword, setSeePassword] = useState(false);
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const { loading } = useSelector((state) => state.user);



    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const loginSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const success = await login(dispatch, input);
            if (success) {
                navigate("/");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">


            <Card className="w-full min-w-[400px] border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        <span className="text-red-500">Form</span>Builder
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={loginSubmitHandler} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    required
                                    type="email"
                                    placeholder="email@example.com"
                                    name="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    required
                                    type={seePassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    name="password"
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    className={`pl-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                <LockKeyhole className="absolute left-3 top-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                <button
                                    type="button"
                                    onClick={() => setSeePassword(!seePassword)}
                                    className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                    {seePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                                )}
                            </div>
                        </div>



                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </Button>

                        <div className="relative my-4">
                            <Separator className="my-4" />
                        </div>

                        <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <Link to="/auth/signup" className="text-red-500 hover:text-red-600 font-medium">
                                Create account
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
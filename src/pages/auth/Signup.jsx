import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, PhoneCall, User2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '@/actions/user-actions';

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [errors, setErrors] = useState({});
    const [seePassword, setSeePassword] = useState(false);
    const [input, setInput] = useState({
        fullname: "",
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


    const signupSubmitHandler = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (input.fullname.length < 3) {
            newErrors.fullname = "Fullname must be at least 3 characters";
        }

        if (input.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // If errors exist, update state and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const success = await signup(dispatch, input);
            if (success) {
                navigate("/auth/verify-email");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
      
            
            <Card className="w-full min-w-[400px] border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/20">
                <CardHeader className="">
                    <CardTitle className="text-2xl font-bold text-center">
                        <span className="text-red-500">Form</span>Builder
                    </CardTitle>
                    <CardDescription className="text-center">
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={signupSubmitHandler} className="space-y-4">
                        <div>
                            <Label htmlFor="fullname">Full Name</Label>
                            <div className="relative">
                                <Input
                                    id="fullname"
                                    required
                                    type="text"
                                    placeholder="John Doe"
                                    name="fullname"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className={`pl-10 ${errors.fullname ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                <User2 className="absolute left-3 top-2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                                {errors.fullname && (
                                    <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>
                                )}
                            </div>
                        </div>

                        <div>
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

                        <div>
                            <Label htmlFor="password" className="text-sm">Password</Label>
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
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/auth/login" className="text-red-500 hover:text-red-600 font-medium">
                                Log in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Signup;
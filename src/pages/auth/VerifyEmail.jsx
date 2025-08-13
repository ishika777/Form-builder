import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyEmail } from "@/actions/user-actions"




const VerifyEmail = () => {

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const inputRef = useRef([])
    const navigate = useNavigate()

    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.user);


    const handleChange = (index, value) => {
        if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
            const newOtp = [...otp]
            newOtp[index] = value;
            setOtp(newOtp);
        }
        if (value !== "" && index < 5) {
            inputRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1].focus()
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        const verificationCode = otp.join("");
        try {
            const success = await verifyEmail(dispatch, verificationCode)
            if (success) {
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 ">


            <Card className="w-full min-w-[400px] border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-800/20">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Verify Your Email
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter the 6 digit code sent to your email address
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="flex justify-between gap-2 sm:gap-3">
                            {otp.map((letter, idx) => (
                                <Input
                                    required
                                    key={idx}
                                    type="text"
                                    value={letter}
                                    maxLength={1}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    ref={(element) => inputRef.current[idx] = element}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-center !text-2xl text-red-500 font-bold rounded-md focus-visible:ring-1 focus-visible:ring-red-500 p-0"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium mt-4"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyEmail
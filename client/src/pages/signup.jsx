import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/router';
import axios from 'axios';

const Signup = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/auth/register`, {
                name,
                email,
                password,
            });

            const data = response.data;
            await login(data.token);
            router.push('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <>
            <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-2xl">Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                            <CardFooter className="flex justify-between mt-4">
                                <Link href="/login"><Button variant="outline">Login</Button></Link>
                                <Button type="submit">Signup</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Signup;

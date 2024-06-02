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

const Login = () => {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            const data = response.data;
            await login(data.token);
            router.push('/'); 
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <div className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid w-full items-center gap-4">
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
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                            <CardFooter className="flex justify-between mt-4">
                                <Link href="/signup"><Button variant="outline">Signup</Button></Link>
                                <Button type="submit">Login</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Login;

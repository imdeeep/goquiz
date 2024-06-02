import Link from 'next/link';
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '../../context/authContext';

const Navbar = ({ onSearch }) => {
    const { isAuthenticated, logout } = useAuth(); 
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchQuery);
    };

    return (
        <div className='w-full shadow-md flex items-center list-none justify-between'>
            <Link href="/">
                <div className="logo text-2xl mx-5 my-4 px-2 py-1 rounded font-semibold border border-black shadow-xl tracking-[-2px] cursor-pointer">
                    goQuiz
                </div>
            </Link>
            <li className='px-5 flex gap-5 text-l'>
                <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">Profile</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {isAuthenticated ? (
                            <>
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Logout</DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <DropdownMenuItem className="cursor-pointer">Login</DropdownMenuItem>
                                </Link>
                                <Link href="/signup">
                                    <DropdownMenuItem className="cursor-pointer">Signup</DropdownMenuItem>
                                </Link>
                            </>
                        )}
                        <DropdownMenuItem className="cursor-pointer"><Link href="https://www.linkedin.com/in/mandeepyadav27/" target='_blank'>Contact
                        </Link></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={handleSearchSubmit}>
                    <Input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search for available quizzes" />
                    <Button type="submit" className="cursor-pointer">Search</Button>
                </form>
            </li>
        </div>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import Head from 'next/head';
import Navbar from '@/components/ui/Navbar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from 'next/link';
import { FaRegPlusSquare } from "react-icons/fa";

const Index = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchQuizzes(currentPage);
  }, [currentPage]);

  const fetchQuizzes = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/quiz/all`, {
        params: {
          page: page,
          limit: 5
        }
      });
      const data = response.data;
      setQuizzes(data.quizzes);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <span>{parts.map((part, i) => part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : part)}</span>;
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>goQuiz</title>
      </Head>
      <main>
        <Navbar onSearch={handleSearch} />
        <div className='page1 w-[95%] mx-auto'>
          <div className="flex justify-between items-center">
            <div className='mt-10'>
              <h1 className='text-3xl font-semibold'>Available Quizzes</h1>
              <span className='bg-black px-2 rounded text-white text-sm'>take quiz</span>
            </div>
            <Link href="/createQuiz" className="flex items-center gap-1 border border-black px-2 py-1 rounded hover:shadow-lg">
              Create
              <FaRegPlusSquare />
            </Link>
          </div>

          <div className='w-full flex mt-8 flex-wrap'>
            {filteredQuizzes.map((quiz) => (
              <div key={quiz._id} className='w-[15vw] m-2'>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {highlightText(quiz.title, searchQuery)}
                    </CardTitle>
                    <CardDescription>{new Date(quiz.createdAt).toLocaleDateString()}</CardDescription>
                    <CardDescription>{quiz.createdBy}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/takequiz/?quiz=${quiz.quizId}`}><Button>Take</Button></Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink href="#" onClick={() => handlePageChange(index + 1)} isActive={index + 1 === currentPage}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </>
  );
};

export default Index;

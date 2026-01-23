import { useState, useEffect } from 'react';

export interface Course {
  id: string;
  title: string;
  thumb: string;
  category: string;
  rating: number;
  price: number;
  instructors: string;
  desc: string;
}

const UseCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Mock data or fetch from your API
    setCourses([
      {
        id: 'anatomy',
        title: 'Learn Human Anatomy',
        thumb: '/assets/courseimages/anatomy.png',
        category: 'Medical',
        rating: 4.9,
        price: 0,
        instructors: 'Dr. Bhanu Prakash',
        desc: 'Master human anatomy with detailed visuals and practical insights.',
      },
        {
        id: 'Ophthalmology',
        title: 'Ophthalmology',
        thumb: '/assets/courseimages/ophthalmology.png',
        category: 'Medical',
        rating: 4.9,
        price: 0,
        instructors: 'Dr. Bhanu Prakash',
        desc: 'Master General Medicine with detailed visuals and practical insights.',
      },
        {
        id: 'Obestrics & Gynecology',
        title: 'Obestrics & Gynecology',
        thumb: '/assets/courseimages/gynecology.png',
        category: 'Medical',
        rating: 4.9,
        price: 0,
        instructors: 'Dr. Bhanu Prakash',
        desc: 'Master Obestrics & Gynecology with detailed visuals and practical insights.',
      },
       {
        id: 'Internal Medicine',
        title: 'Internal Medicine',
        thumb: '/assets/courseimages/internalmedicine.png',
        category: 'Medical',
        rating: 4.9,
        price: 0,
        instructors: 'Dr. Bhanu Prakash',
        desc: 'MasterInternal Medicine with detailed visuals and practical insights.',
      },
         {
        id: 'Medical Biochemistry',
        title: 'Medical Biochemistry',
        thumb: '/assets/courseimages/medicalbiochemistry.png',
        category: 'Medical',
        rating: 4.9,
        price: 0,
        instructors: 'Dr. Bhanu Prakash',
        desc: 'Master Medical Biochemistry with detailed visuals and practical insights.',
      },
      
      // Add more courses if needed
    ]);
  }, []);

  return { courses, setCourses };
};

export default UseCourses;

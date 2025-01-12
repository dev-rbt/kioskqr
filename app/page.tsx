'use client';

import { useEffect } from 'react';
import useLanguageStore from '@/store/useLanguageStore';
import WelcomePage from "../components/welcome/welcome-page";

export default function Home() {
  const { setLanguages } = useLanguageStore();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/getActiveLanguages');
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, [setLanguages]);

  return (
    <WelcomePage />
  );
}

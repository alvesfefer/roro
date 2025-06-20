
import React from 'react';
import Navbar from '@/components/shared/Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-slate-900 to-zinc-900">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="container flex-grow px-2 py-6 mx-auto sm:px-4 sm:py-8"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
  
import React from 'react';
import { motion } from 'framer-motion';
import { pageTransition } from '../utils/animations';
import { useMotion } from '../context/MotionContext';

const PageTransition = ({ children }) => {
    const { animationsEnabled } = useMotion();

    if (!animationsEnabled) {
        return <>{children}</>;
    }

    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;

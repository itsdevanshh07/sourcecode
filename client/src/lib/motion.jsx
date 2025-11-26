import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotion } from '../context/MotionContext';

// Centralized variants matching the template style
export const variants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } }
    },
    slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] } }
    },
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    },
    cardHover: {
        y: -6,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)",
        transition: { duration: 0.2 }
    },
    buttonTap: {
        scale: 0.97
    }
};

export const MotionWrapper = ({ children, variant = 'fadeIn', className, ...props }) => {
    const { animationsEnabled } = useMotion();

    if (!animationsEnabled) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants[variant]}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

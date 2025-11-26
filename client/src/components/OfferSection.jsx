import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, MessageSquare, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { useMotion } from '../context/MotionContext';
import { fadeIn, slideUp, staggerContainer, scaleIn } from '../utils/animations';

const FeatureCard = ({ title, bullets, cta, icon: Icon, badge, onClick, animationsEnabled }) => (
    <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group dark:bg-card-bg dark:border-gray-700"
        variants={scaleIn}
        whileHover={animationsEnabled ? { y: -5 } : {}}
    >
        <div className="absolute top-0 right-0 bg-blue-50 text-navy text-xs font-bold px-3 py-1 rounded-bl-lg">
            {badge}
        </div>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit text-navy group-hover:bg-navy group-hover:text-white transition-colors">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 dark:text-white">{title}</h3>
        <ul className="space-y-2 mb-6">
            {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                </li>
            ))}
        </ul>
        <button
            onClick={onClick}
            className="w-full py-2 border border-navy text-navy rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 dark:hover:bg-blue-900/20"
        >
            {cta} <ArrowRight size={16} />
        </button>
    </motion.div>
);

const OfferSection = () => {
    const navigate = useNavigate();
    const { animationsEnabled } = useMotion();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ASAP Job Portal",
        "description": "Create ATS-ready resumes and practice interviews with AI.",
        "offers": [
            {
                "@type": "Offer",
                "name": "Resume Builder",
                "price": "0",
                "priceCurrency": "USD"
            },
            {
                "@type": "Offer",
                "name": "AI Chatbot",
                "price": "0",
                "priceCurrency": "USD"
            }
        ]
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 dark:from-dark-bg dark:to-slate-900 dark:border-gray-800" aria-labelledby="offerings-title">
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>

            <div className="container mx-auto px-4 2xl:px-20">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start"
                    initial={animationsEnabled ? "hidden" : "visible"}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {/* Left Column: Headline */}
                    <motion.div variants={slideUp} className="lg:col-span-1 space-y-4">
                        <h2 id="offerings-title" className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight dark:text-white">
                            Finish Strong — <br />
                            <span className="text-navy">Build, Chat, Apply</span>
                        </h2>
                        <p className="text-gray-600 text-lg dark:text-gray-400">
                            Create ATS-ready resumes in minutes and get 24/7 interview support from your personal AI assistant.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 pt-2 dark:text-gray-500">
                            <Shield size={16} className="text-green-600" />
                            <span>We never sell your data. Privacy first.</span>
                        </div>
                    </motion.div>

                    {/* Middle: Feature Cards */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeatureCard
                            title="Resume Builder"
                            bullets={["ATS-friendly templates", "One-click PDF export", "AI-powered bullet suggestions"]}
                            cta="Build Resume — Free"
                            icon={FileText}
                            badge="Free-first"
                            onClick={() => { navigate('/resume-builder'); window.scrollTo(0, 0); }}
                            animationsEnabled={animationsEnabled}
                        />
                        <FeatureCard
                            title="Personal AI Chatbot"
                            bullets={["Answer job queries instantly", "Mock interview practice", "Tailored resume tips"]}
                            cta="Chat with AI — Demo"
                            icon={MessageSquare}
                            badge="AI-powered"
                            onClick={() => { document.getElementById('chatbot-trigger')?.click(); }}
                            animationsEnabled={animationsEnabled}
                        />
                    </div>
                </motion.div>

                {/* Bottom CTA Panel */}
                <motion.div
                    className="mt-12 bg-navy rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden"
                    initial={animationsEnabled ? "hidden" : "visible"}
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold">Ready to land your dream job?</h3>
                        <p className="text-blue-100 text-lg">
                            Join thousands of applicants using our tools to get hired faster.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.button
                                onClick={() => { navigate('/applications'); window.scrollTo(0, 0); }}
                                whileHover={animationsEnabled ? { scale: 1.05 } : {}}
                                whileTap={animationsEnabled ? { scale: 0.95 } : {}}
                                className="px-8 py-3 bg-white text-navy rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Get Started — Free
                            </motion.button>
                            <button
                                onClick={() => { navigate('/resume-builder'); window.scrollTo(0, 0); }}
                                className="text-white hover:text-blue-100 underline underline-offset-4 font-medium"
                            >
                                See Resume Samples
                            </button>
                        </div>
                        <p className="text-sm text-blue-200 pt-4">
                            "Built my interview-ready CV in 5 minutes" — A. Kumar
                        </p>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
                </motion.div>


            </div>
        </section>
    );
};

export default OfferSection;

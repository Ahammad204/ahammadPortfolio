import { motion } from 'framer-motion';

/** @param {{ title: string, subtitle?: string }} props */
export default function SectionHeading({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12 text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
      {subtitle && <p className="mt-3 text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
      <div className="mt-4 h-1 w-16 bg-primary mx-auto rounded" />
    </motion.div>
  );
}

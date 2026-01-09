import React from "react";
import { motion } from "framer-motion";
import HeroBgGradient from "./HeroBgGradient";

const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden py-24">
      <HeroBgGradient />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        {/* LEFT */}
        <div className="text-center lg:text-left">
          <span className="inline-block text-sm font-semibold text-indigo-600 mb-3">
            Athena AI • Creative Suite
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-slate-900"
          >
            Create anything, <br />
            <span className="text-indigo-600">faster with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-5 max-w-xl mx-auto lg:mx-0 text-slate-600 text-base sm:text-lg"
          >
            Design visuals, write content, generate code, and build presentations —
            all in one powerful AI workspace.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-7 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
          >
            <a
              href="/login"
              className="px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Start Creating
            </a>
            <a
              href="/login"
              className="px-7 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
            >
              Explore Tools
            </a>
          </motion.div>

          {/* Features */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
            {["AI Design", "Image & Video", "Team Collaboration"].map((f) => (
              <span
                key={f}
                className="px-4 py-2 rounded-full text-xs font-medium bg-white/80 border text-slate-600"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-[420px] rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
            {/* Top bar */}
            <div className="flex gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>

            {/* Content */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-xl border bg-slate-50 p-3">
                <p className="text-xs text-slate-400 mb-1">AI Assistant</p>
                <p className="text-sm text-slate-600">
                  “Create a modern Instagram post for a startup”
                </p>
              </div>

              <div className="rounded-xl border bg-white p-3">
                <p className="text-xs text-slate-400 mb-1">Code</p>
                <pre className="text-xs font-mono text-slate-700">{`<Button>Launch</Button>`}</pre>
              </div>

              <div className="rounded-xl border bg-gradient-to-r from-indigo-100 to-fuchsia-100 p-3">
                <p className="text-xs text-slate-500 mb-1">Design</p>
                <div className="h-10 rounded-lg bg-white/70" />
              </div>
            </div>

            {/* Footer icons */}
            <div className="mt-5 flex justify-between items-center">
              <span className="text-xs font-semibold text-indigo-600">
                New Templates
              </span>
              <div className="flex gap-2">
                {["🎨", "✍️", "💻", "🎬"].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 text-white text-sm"
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

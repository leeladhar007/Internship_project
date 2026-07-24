import { motion } from "framer-motion";

const leadership = [
  {
    name: "Rajeev Vij",
    title: "Founder & CEO",
    image: "/rajivvij.jpg",
    bio: "Rajeev brings more than 30 years of technology leadership, including two decades shaping SaaS and cloud-led innovation. He has led go-to-market programs with global technology leaders and guides AppGallop with a focus on speed, clarity, and measurable business impact.",
  },
  {
    name: "Saranjit Singh",
    title: "Chief Technology Officer",
    image: "/saransir.jpg",
    bio: "Saranjit has over 20 years of experience architecting enterprise solutions across banking, telecom, and public sector domains. At AppGallop, he leads engineering across customer engagement, OEM revenue automation, and lifecycle management.",
  },
  {
    name: "Ashok Kumar",
    title: "Chief Operating Officer",
    image: "/ashok-kumar.jpg",
    bio: "Ashok brings more than 30 years of business transformation experience across IT, cloud, travel, distribution, and product markets. As COO, he drives operational discipline, certification readiness, deployment acceleration, and low-touch execution at scale.",
  },
];

const stats = [
  { value: "10K+", label: "Support tickets resolved" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "< 1s", label: "Average response time" },
  { value: "4.9★", label: "Customer satisfaction" },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="frosted rounded-3xl p-10 text-center shadow-glow"
      >
        <div className="inline-block pastel-gradient rounded-2xl px-4 py-1.5 text-white text-xs font-semibold mb-4 shadow-glow">
          About AppGallop
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Redefining customer support with{" "}
          <span className="pastel-gradient-text">
            artificial intelligence
          </span>
        </h1>

        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          AppGallop Support System is an AI-powered platform designed to help
          businesses deliver instant, accurate, and personalized customer
          support through intelligent automation and enterprise knowledge
          management.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            className="frosted rounded-2xl p-5 text-center shadow-glow"
          >
            <div className="pastel-gradient-text text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-gray-800 mb-6 text-center"
        >
          Leadership
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {leadership.map((person) => (
            <motion.div
              key={person.name}
              variants={item}
              className="frosted rounded-2xl p-6 flex items-start gap-4 shadow-glow hover:shadow-glow-lg transition-shadow duration-300"
            >
              <img
                src={person.image}
                alt={person.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0 shadow-glow"
              />
              <div
                className="w-14 h-14 rounded-full pastel-gradient flex-shrink-0 shadow-glow items-center justify-center text-white font-semibold text-lg"
                style={{ display: "none" }}
              >
                {person.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{person.name}</p>
                <p className="text-sm pastel-gradient-text font-medium">{person.title}</p>
                <p className="text-sm text-gray-500 mt-1.5">{person.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
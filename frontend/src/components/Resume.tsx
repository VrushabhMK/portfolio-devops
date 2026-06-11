import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Download, FileText, Briefcase, GraduationCap } from 'lucide-react'

const experiences = [
  {
    title: 'Senior DevOps Engineer',
    company: 'Infosys Ltd.',
    period: '2022 - Present',
    description: 'Leading cloud infrastructure and CI/CD pipeline development. Managing Kubernetes clusters and automating deployments across AWS.',
  },
  {
    title: 'Full-Stack Developer',
    company: 'TCS Digital',
    period: '2020 - 2022',
    description: 'Built and maintained microservices architecture. Developed React frontend and Node.js backend with MongoDB.',
  },
  {
    title: 'Junior Developer',
    company: 'Wipro Technologies',
    period: '2018 - 2020',
    description: 'Developed responsive web applications. Learned Docker containerization and automated testing practices.',
  },
]

const education = [
  {
    degree: 'M.Tech Computer Science',
    school: 'IIT Bombay',
    period: '2016 - 2018',
  },
  {
    degree: 'B.Tech Software Engineering',
    school: 'NIT Trichy',
    period: '2012 - 2016',
  },
]

export default function Resume() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="resume" className="py-20 lg:py-32">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">Resume</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            My <span className="text-gradient">Experience</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Experience */}
          <div className={isVisible ? 'animate-slide-in-left' : 'opacity-0'}>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Work Experience</h3>
            </div>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
                >
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                  <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold">{exp.title}</h4>
                    <p className="text-sm text-primary">{exp.company}</p>
                    <p className="text-xs text-muted-foreground mb-2">{exp.period}</p>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className={isVisible ? 'animate-slide-in-right' : 'opacity-0'}>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Education</h3>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
                >
                  <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                  <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                    <h4 className="font-semibold">{edu.degree}</h4>
                    <p className="text-sm text-primary">{edu.school}</p>
                    <p className="text-xs text-muted-foreground">{edu.period}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <div className="mt-8 p-6 rounded-xl bg-card border border-border text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Download My Resume</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get a comprehensive overview of my skills and experience
              </p>
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/resume/download`
                  link.target = '_blank'
                  link.download = 'Vrushabh_Kumatgi_Resume.pdf'
                  link.click()
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

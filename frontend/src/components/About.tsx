import { useScrollAnimation } from '../hooks/useScrollAnimation'
import aboutImg from '../assets/images/about-illustration.png'
import { Download, Coffee, Code, Rocket } from 'lucide-react'

const stats = [
  { icon: Code, label: 'Projects Completed', value: '50+' },
  { icon: Coffee, label: 'Chai Cups', value: '3000+' },
  { icon: Rocket, label: 'Deployments', value: '500+' },
]

export default function About() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="about" className="py-20 lg:py-32">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className={`${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-primary rounded-2xl opacity-20 blur-2xl" />
              <img
                src={aboutImg}
                alt="Developer illustration"
                className="relative rounded-2xl shadow-elegant w-full max-w-md mx-auto"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">About Me</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Crafting Digital Experiences with{' '}
              <span className="text-gradient">DevOps Excellence</span>
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              I'm a Full-Stack Developer and DevOps Engineer with 5+ years of experience building
              scalable cloud-native applications. I specialize in creating efficient CI/CD pipelines,
              containerized deployments, and infrastructure automation.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              My expertise spans across React, Node.js, Docker, Kubernetes, Terraform, and AWS.
              I believe in writing clean code, automating everything, and shipping fast.
              When I'm not coding, you'll find me contributing to open-source projects or
              writing technical blogs about DevOps best practices.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                  <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gradient">{value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>

            <a
              href="#resume"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

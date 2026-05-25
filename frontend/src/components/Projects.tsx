import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useState, useEffect } from 'react'
import { ExternalLink, Github, Eye } from 'lucide-react'
import projectPlaceholder from '../assets/images/project-placeholder.png'
import api from '../lib/api'

interface Project {
  _id: string
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  imageUrl: string
  category: string
}

const defaultProjects: Project[] = [
  {
    _id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with payment integration, real-time inventory management, and admin dashboard. Built with microservices architecture.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Docker', 'Redis'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    imageUrl: projectPlaceholder,
    category: 'Full-Stack',
  },
  {
    _id: '2',
    title: 'CI/CD Pipeline Manager',
    description: 'Automated CI/CD pipeline management tool with Jenkins integration, Docker container orchestration, and Slack notifications for deployment status.',
    techStack: ['React', 'Express', 'Jenkins API', 'Docker', 'WebSocket'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    imageUrl: projectPlaceholder,
    category: 'DevOps',
  },
  {
    _id: '3',
    title: 'Cloud Infrastructure Monitor',
    description: 'Real-time cloud infrastructure monitoring dashboard with Prometheus metrics, Grafana visualizations, and automated alerting system.',
    techStack: ['React', 'Go', 'Prometheus', 'Grafana', 'K8s'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    imageUrl: projectPlaceholder,
    category: 'DevOps',
  },
  {
    _id: '4',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates, drag-and-drop interface, and team workspace features.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'MongoDB'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    imageUrl: projectPlaceholder,
    category: 'Full-Stack',
  },
  {
    _id: '5',
    title: 'Kubernetes Auto-Scaler',
    description: 'Custom Kubernetes HPA controller that scales pods based on custom metrics and predictive load analysis using machine learning.',
    techStack: ['Python', 'Kubernetes', 'Docker', 'Prometheus', 'Flask'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    imageUrl: projectPlaceholder,
    category: 'DevOps',
  },
  {
    _id: '6',
    title: 'Real-time Chat Platform',
    description: 'End-to-end encrypted real-time chat platform with video calling, file sharing, and channel management for teams.',
    techStack: ['React', 'WebRTC', 'Socket.io', 'Node.js', 'Redis'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    imageUrl: projectPlaceholder,
    category: 'Full-Stack',
  },
]

export default function Projects() {
  const { ref, isVisible } = useScrollAnimation()
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        if (res.data && res.data.length > 0) setProjects(res.data)
      })
      .catch(() => {})
  }, [])

  const categories = ['All', ...new Set(projects.map(p => p.category))]
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="py-20 lg:py-32">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">My Projects</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </div>

        {/* Filter */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, index) => (
            <div
              key={project._id}
              className={`group rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:-translate-y-2 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-background rounded-full hover:scale-110 transition-transform"
                    aria-label="View source code"
                  >
                    <Github className="h-5 w-5 text-foreground" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-background rounded-full hover:scale-110 transition-transform"
                    aria-label="View live demo"
                  >
                    <ExternalLink className="h-5 w-5 text-foreground" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-background rounded-full hover:scale-110 transition-transform"
                    aria-label="View details"
                  >
                    <Eye className="h-5 w-5 text-foreground" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

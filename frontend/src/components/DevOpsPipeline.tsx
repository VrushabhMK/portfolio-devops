import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useState } from 'react'
import {
  GitBranch, Github, Container, Settings, Box, Cloud,
  Server, Eye, Activity, Database, ArrowRight,
  CheckCircle2, ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react'

// DevOps tools data with detailed info
const devOpsTools = [
  {
    id: 'git',
    name: 'Git',
    icon: GitBranch,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    role: 'Version Control',
    description: 'Distributed version control system for tracking code changes with feature branches and commit history.',
    files: ['.gitignore', 'feature branches', 'commit conventions'],
    status: 'active',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Github,
    color: 'from-gray-600 to-gray-800',
    bgColor: 'bg-gray-500/10',
    role: 'Code Hosting & CI Trigger',
    description: 'Remote repository hosting with webhook integration to trigger Jenkins pipelines automatically on push.',
    files: ['Repository', 'Webhooks', 'Branch Protection'],
    status: 'active',
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: Container,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/10',
    role: 'Containerization',
    description: 'Multi-stage Docker builds for frontend (Nginx) and backend (Node.js). Docker Compose orchestrates all services.',
    files: ['Dockerfile (frontend)', 'Dockerfile (backend)', 'docker-compose.yml'],
    status: 'active',
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    icon: Settings,
    color: 'from-red-500 to-red-700',
    bgColor: 'bg-red-500/10',
    role: 'CI/CD Automation',
    description: 'Automated pipeline: Checkout → Install → Test → Docker Build → Push → K8s Deploy → Verify. Defined in Jenkinsfile.',
    files: ['Jenkinsfile', 'Pipeline stages', 'Docker Hub credentials'],
    status: 'active',
  },
  {
    id: 'dockerhub',
    name: 'Docker Hub',
    icon: Box,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-cyan-500/10',
    role: 'Container Registry',
    description: 'Pushes tagged Docker images automatically. Stores frontend and backend images with build number tags.',
    files: ['portfolio-frontend:latest', 'portfolio-backend:latest'],
    status: 'active',
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: Box,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    role: 'Container Orchestration',
    description: 'Deploys pods with 2 replicas, auto-scaling (HPA), rolling updates, health checks, and ingress routing.',
    files: ['deployment.yaml', 'service.yaml', 'ingress.yaml', 'hpa.yaml'],
    status: 'active',
  },
  {
    id: 'terraform',
    name: 'Terraform',
    icon: Cloud,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10',
    role: 'Infrastructure as Code',
    description: 'Provisions AWS VPC, public/private subnets, Internet Gateway, NAT, EC2 instances, and Security Groups.',
    files: ['main.tf', 'variables.tf', 'modules/vpc/', 'modules/ec2/'],
    status: 'active',
  },
  {
    id: 'ansible',
    name: 'Ansible',
    icon: Server,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    role: 'Configuration Management',
    description: 'Automates EC2 setup: installs Docker, Kubernetes tools (kubectl, minikube), and Jenkins container.',
    files: ['playbook.yml', 'roles/docker/', 'roles/kubernetes/', 'roles/jenkins/'],
    status: 'active',
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: Cloud,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    role: 'Cloud Platform',
    description: 'Hosts the entire application on EC2 with Ubuntu. VPC with public/private subnets and security groups.',
    files: ['EC2 Instance', 'VPC + Subnets', 'Security Groups', 'Elastic IP'],
    status: 'active',
  },
  {
    id: 'prometheus',
    name: 'Prometheus',
    icon: Activity,
    color: 'from-red-400 to-orange-400',
    bgColor: 'bg-red-400/10',
    role: 'Metrics Collection',
    description: 'Scrapes system metrics (Node Exporter), container metrics (cAdvisor), and application metrics at 15s intervals.',
    files: ['prometheus.yml', 'scrape configs', 'alert rules'],
    status: 'active',
  },
  {
    id: 'grafana',
    name: 'Grafana',
    icon: Eye,
    color: 'from-yellow-400 to-orange-400',
    bgColor: 'bg-yellow-500/10',
    role: 'Monitoring Dashboard',
    description: 'Pre-configured dashboards for CPU, memory, container health, HTTP requests, and Kubernetes pod status.',
    files: ['dashboard JSON', 'datasource config', 'auto-provisioning'],
    status: 'active',
  },
]

// Pipeline stages
const pipelineStages = [
  { name: 'Developer', icon: '👨‍💻', detail: 'Code & Commit' },
  { name: 'Git', icon: '🔀', detail: 'Version Control' },
  { name: 'GitHub', icon: '📂', detail: 'Push & Webhook' },
  { name: 'Jenkins', icon: '⚙️', detail: 'Build & Test' },
  { name: 'Docker', icon: '🐳', detail: 'Container Build' },
  { name: 'Docker Hub', icon: '📦', detail: 'Image Push' },
  { name: 'Kubernetes', icon: '☸️', detail: 'Deploy & Scale' },
  { name: 'AWS', icon: '☁️', detail: 'Cloud Hosting' },
]

export default function DevOpsPipeline() {
  const { ref, isVisible } = useScrollAnimation()
  const [expandedTool, setExpandedTool] = useState<string | null>(null)
  const [showPipeline, setShowPipeline] = useState(false)

  const toggleTool = (id: string) => {
    setExpandedTool(prev => prev === id ? null : id)
  }

  return (
    <section id="devops" className="py-20 lg:py-32 bg-gradient-subtle">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">DevOps Pipeline</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            CI/CD <span className="text-gradient">Automation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            End-to-end DevOps workflow with 11 tools: from code commit to cloud deployment, fully automated.
          </p>
        </div>

        {/* CI/CD Pipeline Flow Diagram */}
        <div className={`mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">CI/CD Pipeline Workflow</h3>
              <button
                onClick={() => setShowPipeline(!showPipeline)}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {showPipeline ? 'Collapse' : 'Expand'}
                {showPipeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Pipeline Steps */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-2 min-w-max">
                {pipelineStages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center gap-2">
                    <div className="flex flex-col items-center p-3 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant min-w-[90px]">
                      <span className="text-2xl mb-1">{stage.icon}</span>
                      <span className="text-xs font-semibold text-center">{stage.name}</span>
                      {showPipeline && (
                        <span className="text-[10px] text-muted-foreground text-center mt-1">{stage.detail}</span>
                      )}
                    </div>
                    {index < pipelineStages.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded pipeline details */}
            {showPipeline && (
              <div className="mt-4 p-4 rounded-xl bg-muted/50 animate-fade-in">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="p-3 rounded-lg border border-border">
                    <span className="font-semibold text-primary">Stage 1-2: Code & Version</span>
                    <p className="text-xs text-muted-foreground mt-1">Developer commits to feature branch in Git. Push to GitHub triggers webhook.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <span className="font-semibold text-primary">Stage 3-4: Build & Test</span>
                    <p className="text-xs text-muted-foreground mt-1">Jenkins pulls code, installs deps, runs lint + tests, builds Docker images.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <span className="font-semibold text-primary">Stage 5-6: Push & Registry</span>
                    <p className="text-xs text-muted-foreground mt-1">Tagged images pushed to Docker Hub. Both frontend and backend images with build number tags.</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border">
                    <span className="font-semibold text-primary">Stage 7-8: Deploy & Host</span>
                    <p className="text-xs text-muted-foreground mt-1">K8s applies manifests, rolling update pods. AWS EC2 hosts with Elastic IP.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DevOps Tools Grid */}
        <div className={`mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h3 className="text-xl font-semibold mb-6 text-center">
            11 DevOps Tools <span className="text-gradient">Implemented</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devOpsTools.map((tool, index) => {
              const Icon = tool.icon
              const isExpanded = expandedTool === tool.id

              return (
                <div
                  key={tool.id}
                  className={`rounded-xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 ${
                    isExpanded ? 'sm:col-span-2 lg:col-span-2' : ''
                  } ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Tool Header */}
                  <button
                    onClick={() => toggleTool(tool.id)}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className={`p-2.5 rounded-lg ${tool.bgColor} shrink-0`}>
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{tool.name}</h4>
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      </div>
                      <p className="text-xs text-primary font-medium">{tool.role}</p>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-foreground">Configuration Files:</p>
                        {tool.files.map(file => (
                          <div key={file} className="flex items-center gap-2 text-xs">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <code className="text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{file}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Infrastructure & Monitoring Summary */}
        <div className={`grid md:grid-cols-2 gap-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Infrastructure */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              Infrastructure (Terraform + Ansible)
            </h3>
            <div className="space-y-3">
              {[
                { label: 'VPC', value: '10.0.0.0/16 with public + private subnets' },
                { label: 'EC2', value: 't3.medium Ubuntu 22.04 with Elastic IP' },
                { label: 'Security', value: 'HTTP/443 open, SSH restricted, DB internal only' },
                { label: 'Auto-Config', value: 'Docker, K8s tools, Jenkins via Ansible' },
                { label: 'User Data', value: 'Bootstrap script installs all dependencies' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold">{item.label}</span>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monitoring */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Monitoring (Prometheus + Grafana)
            </h3>
            <div className="space-y-3">
              {[
                { label: 'CPU Usage', value: 'System + per-container CPU utilization' },
                { label: 'Memory', value: 'Process resident memory + system RAM usage' },
                { label: 'Container Health', value: 'cAdvisor metrics for running containers' },
                { label: 'Pod Status', value: 'Kubernetes pod phase and readiness' },
                { label: 'HTTP Requests', value: 'Request rate, latency, error rate' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <span className="text-sm font-semibold">{item.label}</span>
                    <p className="text-xs text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Access Points for Review */}
        <div className={`mt-12 p-6 rounded-2xl bg-card border border-primary/30 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Access Points for Review
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'Frontend', url: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `http://${window.location.hostname}` : 'http://localhost:3000', desc: 'Portfolio Website' },
              { name: 'Backend API', url: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? `http://${window.location.hostname}/api/health` : 'http://localhost:5000/api/health', desc: 'API Health Check' },
              { name: 'Prometheus', url: `http://${window.location.hostname}:9090`, desc: 'Metrics Dashboard' },
              { name: 'Grafana', url: `http://${window.location.hostname}:3001`, desc: 'Monitoring (admin/admin123)' },
              { name: 'Jenkins', url: `http://${window.location.hostname}:8080`, desc: 'CI/CD Pipeline' },
              { name: 'cAdvisor', url: `http://${window.location.hostname}:8081`, desc: 'Container Metrics' },
              { name: 'MongoDB', url: `${window.location.hostname}:27017`, desc: 'Database' },
              { name: 'Node Exporter', url: `http://${window.location.hostname}:9100`, desc: 'System Metrics' },
            ].map(item => (
              <a
                key={item.name}
                href={item.url.startsWith('http') ? item.url : `http://${item.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all hover:-translate-y-1 block cursor-pointer group"
              >
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.name}</p>
                <code className="text-xs text-primary break-all group-hover:underline">{item.url}</code>
                <p className="text-[10px] text-muted-foreground mt-1">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

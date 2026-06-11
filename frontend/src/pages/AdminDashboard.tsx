import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  FolderGit2, 
  Settings, 
  Mail, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Upload, 
  LogOut, 
  Home, 
  CheckCircle2, 
  Clock 
} from 'lucide-react'
import api from '../lib/api'

interface Project {
  _id: string
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  category: string
}

interface Skill {
  _id: string
  name: string
  category: string
  level: number
  icon: string
}

interface Contact {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'contacts' | 'resume'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  
  // Forms states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    category: 'Full-Stack',
  })
  
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend',
    level: 80,
    icon: '⚡',
  })
  
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  
  // Status states
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const projRes = await api.get('/projects')
      if (projRes.data && projRes.data.success) {
        setProjects(projRes.data.data)
      }

      const skillRes = await api.get('/skills')
      if (skillRes.data && skillRes.data.success) {
        setSkills(skillRes.data.data)
      }

      const contactRes = await api.get('/contacts')
      if (contactRes.data && contactRes.data.success) {
        setContacts(contactRes.data.data)
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/')
  }

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000)
  }

  // Projects CRUD
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const parsedStack = projectForm.techStack.split(',').map(s => s.trim()).filter(Boolean)
      const res = await api.post('/projects', {
        ...projectForm,
        techStack: parsedStack,
        imageUrl: '/images/project-placeholder.png' // Default local placeholder
      })
      if (res.data && res.data.success) {
        showStatus('success', 'Project added successfully!')
        setProjectForm({
          title: '',
          description: '',
          techStack: '',
          githubUrl: '',
          liveUrl: '',
          category: 'Full-Stack',
        })
        fetchData()
      }
    } catch (err: any) {
      showStatus('error', err.response?.data?.message || 'Failed to add project.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      const res = await api.delete(`/projects/${id}`)
      if (res.data && res.data.success) {
        showStatus('success', 'Project deleted successfully.')
        fetchData()
      }
    } catch (err) {
      showStatus('error', 'Failed to delete project.')
    }
  }

  // Skills CRUD
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/skills', skillForm)
      if (res.data && res.data.success) {
        showStatus('success', 'Skill added successfully!')
        setSkillForm({
          name: '',
          category: 'Frontend',
          level: 80,
          icon: '⚡',
        })
        fetchData()
      }
    } catch (err: any) {
      showStatus('error', err.response?.data?.message || 'Failed to add skill.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    try {
      const res = await api.delete(`/skills/${id}`)
      if (res.data && res.data.success) {
        showStatus('success', 'Skill deleted successfully.')
        fetchData()
      }
    } catch (err) {
      showStatus('error', 'Failed to delete skill.')
    }
  }

  // Contacts CRUD
  const handleMarkContactRead = async (id: string) => {
    try {
      const res = await api.put(`/contacts/${id}/read`)
      if (res.data && res.data.success) {
        showStatus('success', 'Message marked as read.')
        fetchData()
      }
    } catch (err) {
      showStatus('error', 'Failed to update message status.')
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    try {
      const res = await api.delete(`/contacts/${id}`)
      if (res.data && res.data.success) {
        showStatus('success', 'Message deleted successfully.')
        fetchData()
      }
    } catch (err) {
      showStatus('error', 'Failed to delete message.')
    }
  }

  // Resume Upload
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resumeFile) {
      showStatus('error', 'Please select a file to upload.')
      return
    }
    
    setLoading(true)
    const formData = new FormData()
    formData.append('resume', resumeFile)
    
    try {
      const res = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (res.data && res.data.success) {
        showStatus('success', 'Resume PDF uploaded and saved in database!')
        setResumeFile(null)
      }
    } catch (err: any) {
      showStatus('error', err.response?.data?.message || 'Failed to upload resume.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">
            Portfolio <span className="text-gradient">Console</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Home className="h-4 w-4" /> View Site
          </Link>
          <button 
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid md:grid-cols-[240px_1fr] gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'projects' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <FolderGit2 className="h-5 w-5" /> Projects
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'skills' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Settings className="h-5 w-5" /> Skills
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'contacts' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Mail className="h-5 w-5" /> Contacts 
            {contacts.filter(c => !c.read).length > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {contacts.filter(c => !c.read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
              activeTab === 'resume' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <FileText className="h-5 w-5" /> Resume
          </button>
        </aside>

        {/* Console Workspace */}
        <main className="space-y-6">
          {/* Status Banner */}
          {statusMsg.text && (
            <div className={`p-4 rounded-lg flex items-center gap-2 border text-sm ${
              statusMsg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
            }`}>
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Tab Content: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Form */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" /> Add New Project
                </h2>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Title</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                        placeholder="My Awesome App"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                      >
                        <option value="Full-Stack">Full-Stack</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Cloud">Cloud</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm resize-none"
                      placeholder="Detailed explanation of the project..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      required
                      value={projectForm.techStack}
                      onChange={(e) => setProjectForm({...projectForm, techStack: e.target.value})}
                      className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                      placeholder="React, Node.js, Docker, Kubernetes"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">GitHub URL</label>
                      <input
                        type="url"
                        required
                        value={projectForm.githubUrl}
                        onChange={(e) => setProjectForm({...projectForm, githubUrl: e.target.value})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Live URL</label>
                      <input
                        type="url"
                        required
                        value={projectForm.liveUrl}
                        onChange={(e) => setProjectForm({...projectForm, liveUrl: e.target.value})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:shadow-glow transition-all"
                  >
                    Save Project
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Existing Projects ({projects.length})</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {projects.map(p => (
                    <div key={p._id} className="p-4 rounded-xl bg-card border border-border flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
                          {p.category}
                        </span>
                        <h4 className="font-bold mt-2">{p.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteProject(p._id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              {/* Form */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" /> Add New Skill
                </h2>
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Skill Name</label>
                      <input
                        type="text"
                        required
                        value={skillForm.name}
                        onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                        placeholder="Docker"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Icon Symbol/Emoji</label>
                      <input
                        type="text"
                        required
                        value={skillForm.icon}
                        onChange={(e) => setSkillForm({...skillForm, icon: e.target.value})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                        placeholder="🐳"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={skillForm.category}
                        onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Cloud">Cloud</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Skill Level (0-100%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        required
                        value={skillForm.level}
                        onChange={(e) => setSkillForm({...skillForm, level: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 rounded-md bg-background border border-border outline-none focus:border-primary text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:shadow-glow transition-all"
                  >
                    Save Skill
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Existing Skills ({skills.length})</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {skills.map(s => (
                    <div key={s._id} className="p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{s.icon}</span>
                        <div>
                          <h4 className="font-bold text-sm">{s.name}</h4>
                          <span className="text-[10px] text-muted-foreground">{s.category} ({s.level}%)</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteSkill(s._id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact Form Messages ({contacts.length})</h3>
              {contacts.length === 0 ? (
                <div className="p-8 rounded-xl bg-card border border-border text-center text-muted-foreground text-sm">
                  No messages received yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map(c => (
                    <div 
                      key={c._id} 
                      className={`p-5 rounded-xl bg-card border transition-all ${
                        c.read ? 'border-border' : 'border-primary/50 shadow-elegant bg-primary/5'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{c.name}</span>
                            <span className="text-xs text-muted-foreground">&lt;{c.email}&gt;</span>
                          </div>
                          <h4 className="font-semibold text-sm text-primary mt-1">{c.subject}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {c.read ? (
                              <span className="flex items-center gap-0.5 text-green-500"><CheckCircle2 className="h-3 w-3" /> Read</span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-amber-500"><Clock className="h-3 w-3" /> New</span>
                            )}
                            • {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                          {!c.read && (
                            <button 
                              onClick={() => handleMarkContactRead(c._id)}
                              className="p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-xs flex items-center gap-1 font-semibold"
                            >
                              <Check className="h-3.5 w-3.5" /> Mark Read
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteContact(c._id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 p-3 rounded-lg bg-background border border-border/50 whitespace-pre-wrap">
                        {c.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Resume */}
          {activeTab === 'resume' && (
            <div className="p-6 rounded-xl bg-card border border-border space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Update Resume PDF
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload your updated CV or resume here in PDF format. This file will be stored in your MongoDB database 
                and served to visitors instantly when they click "Download PDF" on your portfolio.
              </p>
              <form onSubmit={handleResumeUpload} className="space-y-4">
                <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors p-8 rounded-xl text-center space-y-4">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <div>
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted cursor-pointer transition-colors">
                      Select PDF File
                      <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="hidden" 
                      />
                    </label>
                    {resumeFile && (
                      <p className="text-sm text-primary font-bold mt-2">
                        Selected: {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Supported format: PDF only (Max 10MB)</p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !resumeFile}
                  className="px-5 py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:shadow-glow transition-all disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload & Save to MongoDB'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

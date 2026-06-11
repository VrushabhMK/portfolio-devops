import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useState, useEffect } from 'react'
import api from '../lib/api'

interface Skill {
  _id: string
  name: string
  category: string
  level: number
  icon: string
}

const defaultSkills: Skill[] = [
  { _id: '1', name: 'React.js', category: 'Frontend', level: 90, icon: '⚛' },
  { _id: '2', name: 'TypeScript', category: 'Frontend', level: 85, icon: '📘' },
  { _id: '3', name: 'Tailwind CSS', category: 'Frontend', level: 88, icon: '🎨' },
  { _id: '4', name: 'Node.js', category: 'Backend', level: 87, icon: '🟢' },
  { _id: '5', name: 'Express.js', category: 'Backend', level: 85, icon: '⚡' },
  { _id: '6', name: 'MongoDB', category: 'Backend', level: 80, icon: '🍃' },
  { _id: '7', name: 'Docker', category: 'DevOps', level: 92, icon: '🐳' },
  { _id: '8', name: 'Kubernetes', category: 'DevOps', level: 85, icon: '☸' },
  { _id: '9', name: 'Jenkins', category: 'DevOps', level: 80, icon: '🔧' },
  { _id: '10', name: 'Terraform', category: 'DevOps', level: 78, icon: '🏗' },
  { _id: '11', name: 'AWS', category: 'Cloud', level: 83, icon: '☁' },
  { _id: '12', name: 'Ansible', category: 'DevOps', level: 75, icon: '📜' },
]

const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Cloud']

export default function Skills() {
  const { ref, isVisible } = useScrollAnimation()
  const [skills, setSkills] = useState<Skill[]>(defaultSkills)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    api.get('/skills')
      .then(res => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setSkills(res.data.data)
        }
      })
      .catch(() => {
        // Use default skills if API fails
      })
  }, [])

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  return (
    <section id="skills" className="py-20 lg:py-32 bg-gradient-subtle">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">My Skills</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Technologies I <span className="text-gradient">Work With</span>
          </h2>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <div
              key={skill._id}
              className={`p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{skill.icon}</span>
                <h3 className="font-semibold">{skill.name}</h3>
                <span className="ml-auto text-sm text-primary font-medium">{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full"
                  style={{
                    width: isVisible ? `${skill.level}%` : '0%',
                    transition: `width 1.5s ease-out ${index * 0.1}s`,
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-2 inline-block">{skill.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

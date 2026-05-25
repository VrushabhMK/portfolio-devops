// MongoDB initialization script
db = db.getSiblingDB('portfolio');

// Create collections
db.createCollection('contacts');
db.createCollection('projects');
db.createCollection('skills');

// Insert seed data for projects
db.projects.insertMany([
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with payment integration and real-time inventory management.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Docker', 'Redis'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'Full-Stack',
    featured: true,
  },
  {
    title: 'CI/CD Pipeline Manager',
    description: 'Automated CI/CD pipeline management tool with Jenkins integration and Docker orchestration.',
    techStack: ['React', 'Express', 'Jenkins API', 'Docker', 'WebSocket'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'DevOps',
    featured: true,
  },
  {
    title: 'Cloud Infrastructure Monitor',
    description: 'Real-time cloud infrastructure monitoring with Prometheus metrics and Grafana dashboards.',
    techStack: ['React', 'Go', 'Prometheus', 'Grafana', 'K8s'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'DevOps',
    featured: false,
  }
]);

// Insert seed data for skills
db.skills.insertMany([
  { name: 'React.js', category: 'Frontend', level: 90, icon: '⚛' },
  { name: 'TypeScript', category: 'Frontend', level: 85, icon: '📘' },
  { name: 'Node.js', category: 'Backend', level: 87, icon: '🟢' },
  { name: 'Docker', category: 'DevOps', level: 92, icon: '🐳' },
  { name: 'Kubernetes', category: 'DevOps', level: 85, icon: '☸' },
  { name: 'AWS', category: 'Cloud', level: 83, icon: '☁' },
]);

print('Database initialized with seed data');

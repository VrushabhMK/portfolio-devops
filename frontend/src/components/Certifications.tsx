import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { Award, ExternalLink } from 'lucide-react'

const certifications = [
  {
    title: 'AWS Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    date: '2024',
    credentialId: 'AWS-SAA-2024-XXXXX',
    verifyUrl: 'https://aws.amazon.com/certification/',
  },
  {
    title: 'Certified Kubernetes Administrator (CKA)',
    issuer: 'Cloud Native Computing Foundation',
    date: '2024',
    credentialId: 'CKA-2024-XXXXX',
    verifyUrl: 'https://www.cncf.io/certification/cka/',
  },
  {
    title: 'Docker Certified Associate',
    issuer: 'Docker Inc.',
    date: '2023',
    credentialId: 'DCA-2023-XXXXX',
    verifyUrl: 'https://docker.com/certification',
  },
  {
    title: 'HashiCorp Terraform Associate',
    issuer: 'HashiCorp',
    date: '2023',
    credentialId: 'TF-2023-XXXXX',
    verifyUrl: 'https://hashicorp.com/certification',
  },
  {
    title: 'Jenkins Engineer Certification',
    issuer: 'CloudBees',
    date: '2023',
    credentialId: 'CJE-2023-XXXXX',
    verifyUrl: 'https://www.cloudbees.com/jenkins-certification',
  },
  {
    title: 'MongoDB Developer Associate',
    issuer: 'MongoDB University',
    date: '2022',
    credentialId: 'MDB-2022-XXXXX',
    verifyUrl: 'https://university.mongodb.com/',
  },
]

export default function Certifications() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="certifications" className="py-20 lg:py-32 bg-gradient-subtle">
      <div ref={ref} className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">Certifications</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Professional <span className="text-gradient">Credentials</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={cert.credentialId}
              className={`group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-primary font-medium">{cert.date}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-xs text-muted-foreground">{cert.credentialId}</span>
                  </div>
                  <a
                    href={cert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    Verify <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

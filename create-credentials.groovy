import jenkins.model.*
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.domains.*
import com.cloudbees.plugins.credentials.impl.*
import org.jenkinsci.plugins.plaincredentials.impl.*
import hudson.util.Secret

def domain = Domain.global()
def store = Jenkins.instance.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()

// Helper: add or replace credential
def upsertCred(store, domain, cred) {
    def existing = store.getCredentials(domain).find { it.id == cred.id }
    if (existing != null) store.removeCredentials(domain, existing)
    store.addCredentials(domain, cred)
    println "Upserted credential: ${cred.id}"
}

// 1. Docker Hub Credentials (UsernamePasswordCredentialsImpl)
// NOTE: Replace DOCKER_HUB_TOKEN below with your actual Docker Hub Personal Access Token
// Generate one at: https://hub.docker.com/settings/security
upsertCred(store, domain, new UsernamePasswordCredentialsImpl(
    CredentialsScope.GLOBAL,
    "docker-hub-credentials",
    "Docker Hub Login",
    "vrushabh131204",
    System.getenv("DOCKER_HUB_TOKEN") ?: "REPLACE_WITH_DOCKER_HUB_TOKEN"
))

// 2. JWT Secret (StringCredentialsImpl / Secret text)
upsertCred(store, domain, new StringCredentialsImpl(
    CredentialsScope.GLOBAL,
    "jwt-secret",
    "JWT Secret for Portfolio Backend",
    Secret.fromString("portfolio-devops-jwt-secret-968138089440")
))

// NOTE: ec2-ssh-key must be added manually via Jenkins UI
// Manage Jenkins -> Credentials -> Add -> SSH Username with private key
// ID: ec2-ssh-key | Username: ec2-user | Key: paste contents of portfolio.pem

Jenkins.instance.save()
println "=== ALL CREDENTIALS CONFIGURED ==="
println "=== Manually add 'ec2-ssh-key' (SSH key) via Jenkins UI ==="

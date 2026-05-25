output "public_ip" {
  value = aws_eip.portfolio.public_ip
}

output "instance_id" {
  value = aws_instance.portfolio.id
}

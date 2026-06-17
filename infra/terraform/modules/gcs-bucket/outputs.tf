output "bucket_name" {
  description = "Name of the image bucket."
  value       = google_storage_bucket.images.name
}

output "storage_sa_email" {
  description = "Email of the storage uploader service account."
  value       = google_service_account.storage.email
}

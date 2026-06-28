resource "google_storage_bucket" "images" {
  name                        = var.bucket_name
  location                    = var.location
  uniform_bucket_level_access = true
  public_access_prevention    = "inherited"
  force_destroy               = var.force_destroy

  labels = {
    managed-by = "terraform"
    app        = "waypoint-bio"
  }


  lifecycle {
    ignore_changes = [encryption]
  }
}

resource "google_service_account" "storage" {
  account_id   = var.storage_sa_id
  display_name = "Waypoint Bio storage uploader"
}

resource "google_storage_bucket_iam_member" "uploader" {
  bucket = google_storage_bucket.images.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.storage.email}"
}

resource "google_storage_bucket_iam_member" "public_read" {
  count  = var.public_read ? 1 : 0
  bucket = google_storage_bucket.images.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

terraform {
  backend "gcs" {
    bucket = "waypoint-bio-tfstate-479099369989"
    prefix = "waypoint/terraform/state"
  }
}

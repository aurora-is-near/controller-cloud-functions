resource "google_storage_bucket" "controller_functions_bucket" {
  name                        = "${var.gcp_project}-controler-functions-source" # Every bucket name must be globally unique
  location                    = "US"
  uniform_bucket_level_access = true
}

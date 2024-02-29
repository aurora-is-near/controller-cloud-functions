resource "google_cloudfunctions2_function" "pause_function" {
  name        = "pause"
  location    = var.gcp_region
  description = ""

  build_config {
    runtime     = "nodejs18"
    entry_point = "pause" # Set the entry point 
    source {
      storage_source {
        bucket = google_storage_bucket.controller_functions_bucket.name
        object = google_storage_bucket_object.controller_functions_bucket_object.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    service_account_email = google_service_account.runner_sa.email

    secret_environment_variables {
      key        = "NEAR_PRIVATE_KEY"
      project_id = var.gcp_project
      secret     = google_secret_manager_secret.near_private_key.secret_id
      version    = "latest"
    }

    secret_environment_variables {
      key        = "ETH_PRIVATE_KEY"
      project_id = var.gcp_project
      secret     = google_secret_manager_secret.eth_private_key.secret_id
      version    = "latest"
    }
  }

  depends_on = [google_secret_manager_secret.near_private_key, google_secret_manager_secret.eth_private_key]
}


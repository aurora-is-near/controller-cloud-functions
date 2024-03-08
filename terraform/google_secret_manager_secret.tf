resource "google_secret_manager_secret" "near_private_key" {
  secret_id = "controller-functions-near-pk"

  replication {
    user_managed {
      replicas {
        location = var.gcp_region
      }
    }
  }
  depends_on = [
    google_project_service.secretmanager
  ]
}

resource "google_secret_manager_secret" "eth_private_key" {
  secret_id = "controller-functions-eth-pk"

  replication {
    user_managed {
      replicas {
        location = var.gcp_region
      }
    }
  }
  depends_on = [
    google_project_service.secretmanager
  ]
}

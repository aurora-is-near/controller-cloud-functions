resource "google_secret_manager_secret_iam_binding" "near_private_key_iam_binding" {
  secret_id = google_secret_manager_secret.near_private_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${google_service_account.runner_sa.email}",
  ]
}

resource "google_secret_manager_secret_iam_binding" "eth_private_key_iam_binding" {
  secret_id = google_secret_manager_secret.eth_private_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${google_service_account.runner_sa.email}",
  ]
}

resource "google_secret_manager_secret_version" "near_private_key_version" {
  secret = google_secret_manager_secret.near_private_key.name

  secret_data = var.near_private_key
  enabled     = true
}

resource "google_secret_manager_secret_version" "eth_private_key_version" {
  secret = google_secret_manager_secret.eth_private_key.name

  secret_data = var.eth_private_key
  enabled     = true
}

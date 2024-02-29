data "google_iam_policy" "runner" {
  binding {
    role = "roles/iam.serviceAccountUser"

    members = [
      "serviceAccount:${google_service_account.runner_sa.email}",
    ]
  }
}

resource "google_service_account" "runner_sa" {
  account_id   = "controller-functions-runner"
  display_name = "A service account for running controller cloud functions"
}

resource "google_service_account_iam_policy" "runner_sa_iam_policy" {
  service_account_id = google_service_account.runner_sa.name
  policy_data        = data.google_iam_policy.runner.policy_data
}

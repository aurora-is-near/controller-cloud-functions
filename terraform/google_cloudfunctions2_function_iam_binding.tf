resource "google_cloudfunctions2_function_iam_binding" "pause_function_invoker" {
  cloud_function = google_cloudfunctions2_function.pause_function.name
  role = "roles/cloudfunctions.invoker"
  members = [
    "allUsers",
  ]
}

resource "google_cloud_run_service_iam_member" "pause_run_invoker" {
  location = google_cloudfunctions2_function.pause_function.location
  service  = google_cloudfunctions2_function.pause_function.name
  role     = "roles/run.invoker"
  member = "allUsers"
}

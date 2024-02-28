output "pause_function_uri" {
  value = google_cloudfunctions2_function.pause_function.service_config[0].uri
}

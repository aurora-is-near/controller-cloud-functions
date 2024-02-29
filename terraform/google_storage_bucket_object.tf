resource "google_storage_bucket_object" "controller_functions_bucket_object" {
  name   = "controller-functions-source.zip"
  bucket = google_storage_bucket.controller_functions_bucket.name
  source = var.functions_zip_path
}


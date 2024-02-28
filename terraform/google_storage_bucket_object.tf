resource "google_storage_bucket_object" "controller_functions_bucket_object" {
  name   = "function-source.zip"
  bucket = google_storage_bucket.controller_functions_bucket.name
  source = "function-source.zip" # Add path to the zipped function source code
}


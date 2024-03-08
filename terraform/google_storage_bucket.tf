locals {
  file_name = "controller-functions-source.zip"
}

data "archive_file" "function_archive" {
  type        = "zip"
  source_dir  = var.functions_source_path
  output_path = local.file_name
}

resource "google_storage_bucket" "controller_functions_bucket" {
  name                        = "controller-functions-source" # Every bucket name must be globally unique
  location                    = "US"
  uniform_bucket_level_access = true
}

resource "google_storage_bucket_object" "controller_functions_bucket_object" {
  name   = format("%s#%s", local.file_name, data.archive_file.function_archive.output_md5)
  bucket = google_storage_bucket.controller_functions_bucket.name
  source = data.archive_file.function_archive.output_path
}

resource "google_project_service" "cloudbuild" {
  service = "cloudbuild.googleapis.com"

  timeouts {
    create = "30m"
    update = "40m"
  }

  # disable_dependent_services = true
}

resource "google_project_service" "cloudfunctions" {
  service = "cloudfunctions.googleapis.com"

  timeouts {
    create = "30m"
    update = "40m"
  }

  # disable_dependent_services = true
}

resource "google_project_service" "secretmanager" {
  service = "secretmanager.googleapis.com"

  timeouts {
    create = "30m"
    update = "40m"
  }

  # disable_dependent_services = true
}

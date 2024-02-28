variable "gcp_project" {
  description = "The GCP project ID."
  default     = "aurora-backstage"
}

variable "gcp_region" {
  description = "The GCP region."
  default     = "us-central1"
}


variable "near_private_key" {
  description = "Near private key used by functions"
}

variable "eth_private_key" {
  description = "Eth private key used by functions"
}

